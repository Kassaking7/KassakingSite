---
title: 'eLibrary Springboot Project'
date: '2023-08-27'
---

### Intro

This is a blog sharing my thought and new update on my [CS348](https://ucalendar.uwaterloo.ca/2324/COURSE/course-CS.html#CS348) Database Management Course project.

The source code can be found in this [repo](https://github.com/Kassaking7/eLibraryManagementSystem).

Also the original version can be found in another branch [CS348version](https://github.com/Kassaking7/eLibraryManagementSystem/tree/CS348version).

This project was originally finished on 2023-04-01 and submitted to github as CS348 final project. The front-end uses **Next.js**, the back-end uses **Springboot** and the database uses the relational database **MySQL**.

The running logic is that the front end sends post or get requests to the backend api through **Axios**. The backend controller layer accepts requests, and the service layer executes different logic including fetching data from database.

However, the original project do have serveral problems: 
* Authorization is not implemented
  * It's dangerous for backend API doesn't have authorization verification.
  
* APIs are messy
  * APIs like "/listBookISBNTag" and "/findCopyByISBNAndCopyId" look messy and not elegant. 

* Services are done in MySQL procedure instead of in Service layer
  * It can be seen from the orignal project that Service layer only invoke Mappers and most Mappers are invoking procedures in MySQL.

* Front end code are messy
  * The problem is when I worked on this project, I actually have limitted knowledge on React & Next.js, causing that I write duplicated codes instead of components.

Since I just finished my second coop and there are still several days before new semester, I have plenty of time to optimize my code!

### What's new

In short. The major stuff I did is implementing session-based Authorization with **Redis** and new service. I also improved most existing APIs to be **RESTful** and modified several Services. 

(Frontend codes are still kind of messy, so it's in my TODO list)

### Session-based Authorization

I do learn 2 new tools for authorization. One is **Spring Security** and one is **Redis**.

Spring Security provide a powerful function to acheive session-based authorization.
Below is my filterChain inside Configuration Class
```
@Bean
public SecurityFilterChain filterChain(HttpSecurity http,
                                        PersistentTokenRepository repository) throws Exception {
    return http
            .authorizeHttpRequests(conf -> {
                conf.requestMatchers("/api/auth/**").permitAll();
                conf.anyRequest().authenticated();
            })
            .formLogin(conf -> {
                conf.loginProcessingUrl("/api/auth/login");
                conf.failureHandler(this::onAuthenticationFailure);
                conf.successHandler(this::onAuthenticationSuccess);
                conf.permitAll();
            })
            .logout(conf-> {
                conf.logoutUrl("/api/auth/logout");
                conf.logoutSuccessHandler(this::onAuthenticationSuccess);                    
                conf.permitAll();
            })
            .cors(conf -> {
                CorsConfiguration cors = new CorsConfiguration();
                cors.addAllowedOriginPattern("*");
                cors.addAllowedOriginPattern("http://127.0.0.1:3000");
                cors.addAllowedOriginPattern("http://127.0.0.1:3000/signup");
                cors.setAllowCredentials(true);
                cors.addAllowedHeader("*");
                cors.addAllowedMethod("*");
                cors.addExposedHeader("*");
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", cors);
                conf.configurationSource(source);
            })
            .userDetailsService(authorizeService)
            .exceptionHandling(conf->{
                conf.authenticationEntryPoint(customAuthenticationEntryPoint);
            })
            .rememberMe(conf -> {
                conf.rememberMeParameter("remember");
                conf.tokenRepository(repository);
                conf.tokenValiditySeconds(3600*24*3);
            })
            .csrf((csrf) -> {
                csrf.disable();})
            .build();
}
```
"anyRequest().authenticated()" help me to block unauthorized requests.

Also now password are stored as hash value instead of specific password.

```
@Bean
public BCryptPasswordEncoder passwordEncoder(){
    return new BCryptPasswordEncoder();
}
```

Then we need a Intercepter to obtain Cookie (where session stored):
```
@Component
public class AuthorizeInterceptor implements HandlerInterceptor {
    @Resource
    PeopleMapper mapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) 
    throws Exception {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        User user = (User)authentication.getPrincipal();
        String username = user.getUsername();
        AccountUser account = mapper.findAccountUserByNameOrEmail(username);
        request.getSession().setAttribute("account", account);
        System.out.println(authentication.getPrincipal());
        return true;
    }
}
```
This could be then added to all APIs and then we can check the session information we send to Client side.

```
@Configuration
public class WebConfiguration implements WebMvcConfigurer {

    @Resource
    AuthorizeInterceptor interceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry
                .addInterceptor(interceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/api/**");
    }
}
```

### APIs

I optimized all my backend APIs and tried to make most of them **RESTful** (Though it's not true for login/logout API since they are session-based. I will try JWT someday...)

To make them RESTful. I need them:
* Statelessness
  * Not possible for session-based login API but already okay for rest APIs.

* URI -> Resources
  * I use URI to show what front end would expect to get from that API. One example is "GET /api/book/{ISBN}", which is more readable and elegant.

I also made 2 new APIs "Sign up" and "reset password". The reason I call them new is that the original APIs are completely different compared with the previous APIs, which only insert a new user or change the password in database.
For new APIs, I will send an email to user to verify the email address, then user can sign up or reset their password. And it is where I use **Redis** to quick fetch session information.



```
public String sendValidateEmail(String email, String sessionId, boolean hasAccount) {
    System.out.println("get sessionId: " + sessionId);
    String key = "email:" + sessionId + ":" + email + ":" +hasAccount;
    if(Boolean.TRUE.equals(stringRedisTemplate.hasKey(key))) {
        Long expire = Optional.ofNullable(stringRedisTemplate.getExpire(key, TimeUnit.SECONDS)).orElse(0L);
        if(expire > 120) return "Too many requests, please try again later.";
    }
    People account = mapper.findPeopleByNameOrEmail(email);
    if(hasAccount && account == null) return "There is no account associated with this email address.";
    if(!hasAccount && account != null) return "This email address has already been registered by another user.";
    Random random = new Random();
    int code = random.nextInt(899999) + 100000;
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(from);
    message.setTo(email);
    message.setSubject("Your verification code email");
    message.setText("Verification code: "+code);
    try {
        mailSender.send(message);
        template.opsForValue().set(key, String.valueOf(code), 3, TimeUnit.MINUTES);
        return null;
    } catch (MailException e) {
        e.printStackTrace();
        return "Email sending failed, please check if the email address is valid.";
    }
}

public String validateAndRegister(String username, String password, String email, String code, String sessionId) {
    String key = "email:" + sessionId + ":" + email + ":false";
    System.out.println("get sessionId: " + sessionId);
    if(Boolean.TRUE.equals(stringRedisTemplate.hasKey(key))) {
        String s = stringRedisTemplate.opsForValue().get(key);
        if(s == null) return "Verification code has expired, please request again.";
        if(s.equals(code)) {
            People account = mapper.findPeopleByNameOrEmail(username);
            if(account != null) {
                return "This username has already been registered, please choose a different username.";
            }
            stringRedisTemplate.delete(key);
            password = encoder.encode(password);
            if (mapper.createAccount(username, password, email) > 0) {
                return null;
            } else {
                return "Internal error, please contact the administrator.";
            }
        } else {
            return "Incorrect verification code, please check and submit again.";
        }
    } else {
        return "Please request a verification code email first";
    }
}
```

The email server I use is 163.com.

### Services

As previously all services are done in MySQL procedure. I attempted to deprecate them and write services in service layer.
One example could be:

Original procedure:
```
DELIMITER //
CREATE PROCEDURE event_setup(
    IN event_name              VARCHAR(100),
    IN start_date_time         VARCHAR(100),
    IN end_date_time           VARCHAR(100),
    IN capacity                INT,
    IN description             VARCHAR(6000),
    IN location_ID             BIGINT,
    IN admin_ID                BIGINT,
    OUT if_succeeded           BOOLEAN
)

proc_label: BEGIN
    -- varchar to datetime
    SET @start_time = (SELECT CONVERT(start_date_time, DATETIME));
    SET @end_time = (SELECT CONVERT(end_date_time, DATETIME));
    
    -- check if the Administrator can host event
    SET if_succeeded = (admin_ID in (SELECT ID FROM Administrator inner join
    in_charged_by on in_charged_by.administrator_ID = Administrator.ID where in_charged_by.location_ID = location_ID
    AND Administrator.can_host_event = TRUE));
    
    -- exit the process if fail
    IF (if_succeeded = FALSE) THEN
        LEAVE proc_label;
    END IF;

    -- check if the start/end time is within the opening time of the location
    SET @after_open = ((SELECT open_time FROM Location WHERE Location.ID = location_ID) <= (SELECT TIME(@start_time)) and (@start_time >= (SELECT NOW())));
    SET @before_close = ((SELECT close_time FROM Location WHERE Location.ID = location_ID) >= (SELECT TIME(@end_time)) and (@start_time >= (SELECT NOW())));
    SET if_succeeded = 
    CASE
        WHEN ((@after_open = TRUE) AND (@before_close = TRUE)) THEN TRUE
        ELSE FALSE
    END;

    -- exit the process if fail
    IF (if_succeeded = FALSE) THEN
        LEAVE proc_label;
    END IF;

    -- check if the start_date_time and end_date_time overlap with other event
    SET @conflict_event = (SELECT COUNT(*) FROM Event
                            WHERE Event.location_ID = location_ID
                            AND  ((@start_time BETWEEN Event.start_date_time AND Event.end_date_time) OR 
								(@end_time BETWEEN Event.start_date_time AND Event.end_date_time))
                                );
    
    SET if_succeeded = 
    CASE
        WHEN (@conflict_event = 0) THEN TRUE
        ELSE FALSE
    END;

	-- exit the process if fail
    IF (if_succeeded = FALSE) THEN
        LEAVE proc_label;
    END IF;

    -- insert a record into Event table
    INSERT INTO Event (name, start_date_time, end_date_time, capacity, current_amount, description, location_ID, admin_ID)
    VALUES(event_name, @start_time, @end_time, capacity, 0, description, location_ID, admin_ID);

END //
```

After moving everything to Springboot Service layer:

```
public Boolean insertEvent(Event event) {
    String eventName = event.getName();
    String startDateTime = event.getStartDateTime();
    String endDateTime = event.getEndDateTime();
    int capacity = event.getCapacity();
    String description = event.getDescription();
    long locationID = event.getLocationID();
    long adminID = event.getAdminID();

    Boolean canHoldEvent = adminMapper.canHoldEvent(adminID,locationID);
    if (canHoldEvent == false) return false;
    Boolean validTime = locationTimeCheck(startDateTime, endDateTime, locationID);
    if (validTime == false) return false;
    Boolean noOverlappingEvents = eventMapper.checkOverlappingEvents(startDateTime, endDateTime, locationID);
    if (noOverlappingEvents == false) return false;
    System.out.println("No overlapping");
    try {
        eventMapper.insertEvent(eventName, startDateTime, endDateTime, capacity, description, locationID, adminID);
        return true; // Insertion was successful
    } catch (Exception e) {
        System.out.println("insertion fail");
        e.printStackTrace();
        return false; // Insertion failed
    }
}
```

The insertion logic has not been changed but just moved it to Backend instead of in MySQL procedure, making it easy to testing and catching exceptions.
