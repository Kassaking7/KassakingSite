---
title: 'Unity 2D game design Dev Notes'
date: '2023-06-08'
---



## Everything starts here

The code can be see at [github](https://github.com/Kassaking7/2D-side-scroller-game).

I came up with the idea of designing a 2D game using Unity at the beginning of 2023. The reason might be I see some interesting game-designing videos.
To start this jouney, I first took a look at some tutorial videoes at youtube. 

One good video I watched is the flip bird tutorial [here](https://www.youtube.com/watch?v=XtQMytORBmM)

I don't spend too much time on learning the syntax of C# at the very first, since I feel it pretty much like C++/Java.

## Basic Stuffs
##### 2023 Jan ~ Mar

My idea is making a 2D side-srcolling game, Maybe like Hollow Knight. I first collected some useful spirtes. Luckliy I found some and they are made by [Aseprite](https://www.aseprite.org/). Since they are pixel, I do have a good time designing their property and organize them in my game.

Now I get everything I need. It's time to create the character and the backgrounds in Unity. 

![1](/images/Unity2DGame/1.png)

(The screenshot is from the latest version, where lights, trashBin, etc.. all added)

The backgrounds and grounds are placed using **Tilemap**. In this case it's easier to assign properties to them.

Before writing the scripts on moving, I notice there should be physical components added to player and grounds. basically **Rigidbody 2D** and **Box Collider 2D** (usually with *is Trigger*)

The character need to have the ability to move and attack. The picture for that are already collected. So I just make some animations and scripts to enable moving and attacking.

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerMoveScript : MonoBehaviour
{
    public float runSpeed;
    public float jumpSpeed;
    public float jumpSecondSpeed;
    private Rigidbody2D myRigdbody;
    private Animator myAnim;
    private BoxCollider2D myFeet;
    private bool isGround;
    private bool DoubleJumpIsAble;
    private PlayerHealth playerHealth;
    private bool isJumping;
    private bool isFailling;
    private bool isDoubleJumping;
    private bool isDoubleFalling;

    private float playerGravity;

    private PlayerInputAction controls;
    private Vector2 move;


    // Start is called before the first frame update
    void Start()
    {
        myRigdbody = GetComponent<Rigidbody2D>();
        myAnim = GetComponent<Animator>();
        myFeet = GetComponent<BoxCollider2D>();
        playerHealth = GetComponent<PlayerHealth>();
        playerGravity = myRigdbody.gravityScale;
    }

    // Update is called once per frame
    void Update()
    {
        if (playerHealth.health > 0)
        {
            CheckAirStatus();
            Flip();
            Run();
            Jump();
            Climb();
            CheckGround();       
            SwitchAnimation();
        } else
        {
            myRigdbody.velocity = new Vector2(0, myRigdbody.velocity.y);
        }

    }
    void Run()
    {
        float moveDir = Input.GetAxis("Horizontal");
        Vector2 playerVel = new Vector2(moveDir * runSpeed, myRigdbody.velocity.y);
        myRigdbody.velocity = playerVel;
        bool playerHasXAsixSpeed = Mathf.Abs(myRigdbody.velocity.x) > Mathf.Epsilon;
        myAnim.SetBool("Run", playerHasXAsixSpeed);

        //Vector2 playerVel = new Vector2(move.x * runSpeed, myRigdbody.velocity.y);
        //myRigdbody.velocity = playerVel;
        //bool playerHasXAsixSpeed = Mathf.Abs(myRigdbody.velocity.x) > Mathf.Epsilon;
        //myAnim.SetBool("Run", playerHasXAsixSpeed);
    }
  ...
}

```

For better reading I omit rest code. The basic methods for unity engine are **start()** and **update()**, the former invoke when the instance is first initialized. Then the latter invokes every **frame**.

 It can be seen that I have 2 approaches on implementing *Run()*. The first one is using *Input*, it can be set in edit->project setting->Input manager. The second one is using Input System. But after testing I feel that the second method has a poor hand feel, and the movement of the characters is very stiff.

Here I also use animatior to make the player run with correct animation:

![1](/images/Unity2DGame/2.png)

Similarly for enemy, but since we may have different enemies in the future, so a super class is required.

```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public abstract class Enemy : MonoBehaviour
{
    public int health;
    public int damage;
    public float flashTime;
    public GameObject bloodEffect;
    public GameObject dropCoin;

    public GameObject floatPoint;

    private SpriteRenderer sr;
    private Color originalColor;
    private PlayerHealth playerHealth;
    // Start is called before the first frame update
    public void Start()
    {
        playerHealth = GameObject.FindGameObjectWithTag("Player").GetComponent<PlayerHealth>();
        sr = GetComponent<SpriteRenderer>();
        originalColor = sr.color;
    }

    // Update is called once per frame
    public void Update()
    {
        if (health <= 0)
        {
            Instantiate(dropCoin, transform.position, Quaternion.identity);
            Destroy(gameObject);
        }
    }

    public void TakeDamage(int _damage)
    {
        FlashColor(flashTime);
        health -= _damage;
        Instantiate(bloodEffect, transform.position, Quaternion.identity);
        GameController.camShake.Shake();
        GameObject gb = Instantiate(floatPoint,transform.position, Quaternion.identity) as GameObject;
        gb.transform.GetChild(0).GetComponent<TextMesh>().text = _damage.ToString();
    }

    void FlashColor(float time)
    {
        sr.color = Color.red;
        Invoke("ResetColor", time);
    }

    void ResetColor()
    {
        sr.color = originalColor;
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.gameObject.CompareTag("Player") && other.GetType().ToString() == "UnityEngine.CapsuleCollider2D")
        {
            if (playerHealth != null)
            {
                playerHealth.DamagePlayer(damage);
            }
        }
    }
}

```

Here I also attached the code for flashing color, this is invoked when the enemies is damaged (by any object as long as they are interactive).

It can be seen that most interaction between objects are done by communicating the *tag*

There are also some stuffs like Camera follow, shaking, player hit and death, UI (like HP, screen flashing, spikes etc) I will add more details on those part in the future..



##### 2023 April

I stop 1 month for final exams.

##### 2023 May

I notice I have a picture of sickle so I come up with the idea of boomerang. Here is the code

```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Sickle : MonoBehaviour
{
    public float speed;
    public int damage;
    public float rotateSpeed;
    public float tuning;
    private Rigidbody2D rb2d;
    private Transform playerTransform;
    private Transform sickleTransform;
    private Vector2 startSpeed;
    private CameraShake camShake;
    // Start is called before the first frame update
    void Start()
    {
        SickleHit.oneExist = true;
        rb2d = GetComponent<Rigidbody2D>();
        rb2d.velocity = transform.right * speed;
        startSpeed = rb2d.velocity;
        playerTransform = GameObject.FindGameObjectWithTag("Player").GetComponent<Transform>();
        sickleTransform = GetComponent<Transform>();
        camShake = GameObject.FindGameObjectWithTag("CameraShake").GetComponent<CameraShake>();
    }

    // Update is called once per frame
    void Update()
    {
        transform.Rotate(0, 0, rotateSpeed * Time.deltaTime);
        float y = Mathf.Lerp(transform.position.y, playerTransform.position.y, tuning);
        transform.position = new Vector3(transform.position.x, y, 0);
        rb2d.velocity -= startSpeed * Time.deltaTime;
        if (Mathf.Abs(transform.position.x - playerTransform.position.x) < 0.5f)
        {
            SickleHit.oneExist = false;
            Destroy(gameObject);
        }
    }
    private void OnTriggerEnter2D(Collider2D other)
    {
      if(other.gameObject.CompareTag("Enemy"))
        {
            other.GetComponent<Enemy>().TakeDamage(damage);
        }  
    }
}

```

*OnTriggerEnter2D* works when the object collide with other object (They both have to be collider 2D), this function is used to damage the enemies. The idea is when the instance of sickle is initialized, if obtain a init speed and the body type of **Rigidbody 2D** is set to *Kinematic* and thus it wouldn't be affected by the gravity. Then adding negative velocity each frame, making it back when its velocity come negative.

Also, to update the y-axis to make sure the sickle is following player (It's weird when the sickle comes to the player's origin position and disappeared), I use *Mathf.Lerp* to update the y-axis. The function works like finding the mid point of two points, but it provides a *tunning* ($\in [0,1]$), to decide the portion of 2 points contributes.

Adding a command to throw it:

```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SickleHit : MonoBehaviour
{
    public GameObject sickle;
    public static bool oneExist;
    // Start is called before the first frame update
    void Start()
    {
        oneExist = false;
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.U) && !oneExist)
        {
            Instantiate(sickle, transform.position, transform.rotation);
        }
    }

}
```



![3](/images/Unity2DGame/3.png)

It looks good. But one problem is that when I jump, the sickle will also "jump", which is not I expected to happen. I want it remain its y-axis when it's dashing and go back to player's current position. So I add a control-flow for it:

```
void Update()
    {
        transform.Rotate(0, 0, rotateSpeed * Time.deltaTime);
        if (curpositive != positive)
        {
            float y = Mathf.Lerp(transform.position.y, playerTransform.position.y, tuning);
            transform.position = new Vector3(transform.position.x, y, 0);
        }
        rb2d.velocity -= startSpeed * Time.deltaTime;
        curpositive = (rb2d.velocity.x > 0);
        ...
    }
```

Also:

```
void Start()
    {
        ...
        positive = (startSpeed.x > 0);
        curpositive = positive;
        ...
    }
```

This making sure the sickle's y-axis only changes when it's going back.
