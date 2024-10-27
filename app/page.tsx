export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section id="greeting" className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-black bg-opacity-70 p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-4">Welcome to My Personal Website</h1>
          <p className="text-xl">Scroll down to learn more about me!</p>
        </div>
      </section>

      <section id="about" className="min-h-screen py-16">
        <div className="bg-black bg-opacity-70 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-8">About Me</h2>
          <p className="text-lg mb-4 ">
            Hello! I&apos;m Zhiyuan Wang. I&apos;m a currently a fourth year student majoring in Computer Science @ University of Waterloo.
          </p>
          <p className="text-lg mb-4">
            A strong passion for Backend, Game Developing, and Games :)
          </p>
        </div>
      </section>

      <section id="experience" className="min-h-screen py-16">
        <div className="bg-black bg-opacity-70 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-8">Internship Experience</h2>
          <div className="space-y-8">
            <div className="border border-green-400 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Ripple</h3>
              <p className="text-green-300 mb-2">Software Engineer Intern - 2024-05 -{">"} 2024-08</p>
              <ul className="list-disc list-inside">
                <li>Contributed to the DeFi Team by developing new functionalities on XRPL servers to support the launch of multi-purpose tokens, enhancing institutional DeFi capabilities on the XRPL and driving adoption of decentralized finance solutions.</li>
                <li>Designed a new feature for the XRP Ledger API server to retrieve expired ledger object information directly from
the blockchain using <b>C++</b>. This bypasses transaction history searches, reducing data retrieval time for developers
from unpredictable (1 second to hours) to consistently under <b>1 second</b></li>
                <li>Optimized codebase and Cassandra query to utilize the in-memory thread-save cache, reducing the required data
access to the database. This improves the retrieving speed by <b>10%</b></li>
              </ul>
            </div>
            <div className="border border-green-400 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Huawei Technologies Canada Co.</h3>
              <p className="text-green-300 mb-2">Software Engineer Intern - 2023-05 -{">"} 2023-08</p>
              <ul className="list-disc list-inside">
                <li>Contributed to Compiler Team by implementing optimizations on Bisheng LLVM Compiler that outperformed the
original LLVM</li>
                <li>Analyzed and optimized Bisheng <b>LLVM</b> compiler, including optimizing C++ source code on SLP vectorization and
conducting <b>regression tests</b> on CPU performance assessment. The optimization reduced CPU perf count on
benchmark function by <b>20%</b></li>
                <li>Streamlined codebase by eliminating redundancy through breakpoint testing, resulting in a <b>300-line</b> code reduction</li>
              </ul>
            </div>
            <div className="border border-green-400 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Horizn</h3>
              <p className="text-green-300 mb-2">Software Engineer Intern - 2022-09 -{">"} 2022-12</p>
              <ul className="list-disc list-inside">
                <li>Contributed to Dev Team by crafting digital product learning platforms for various financial institutions, allowing an
                acceleration on the impact of their digital transformation strategy </li>
                <li>Revamped legacy <b>React</b> code by crafting reusable, scalable, and mobile-responsive components that are now
utilized throughout the platforms. This initiative enhances code maintainability and significantly reduces time spent
resolving component-related issues</li>
                <li>Optimized <b>Laravel</b> code by seamlessly integrating existing database operation methods, resulting in a <b>40%</b> reduction in required migration code</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="min-h-screen py-16">
      <div className="bg-black bg-opacity-70 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-8">Project</h2>
          <div className="space-y-8">
            <div className="border border-green-400 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 flex items-center">AI-Driven InsightCraft   <a className="ml-4" href="https://github.com/AI-Driven-InsightCraft" target="_blank" rel="noopener noreferrer">
      <img src="github.svg" alt="GitHub" className="w-6 h-6 text-green-400"  />
    </a></h3>
              
              <ul className="list-disc list-inside">
                <li>Developed an intelligent data analysis platform leveraging Springboot and React (Ant Design and TypeScript).
Users can send raw Excel data and specific analysis requests to the platform, and then receive visual data charts
and analysis from AIGC (AI-Generated Content). This streamlines the process for data analysts on EDA</li>
<li>Implemented Distributed Rate Limiting using Redis with the token bucket algorithm, preventing excessive
requests to overwhelming third-party APIs and ensuring system stability</li>
<li>Customized I/O-intensive thread pool and task queue (by JUC and RabbitMQ), achieving concurrent
execution and asynchrony for AIGC, enabling immediate frontend responsiveness upon task submission and
improving user experience</li>
                </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}