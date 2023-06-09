import Head from 'next/head'
import Image from 'next/image'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
        <div className={utilStyles.center}>
      <Image
              priority
              src="/images/profile.jpg"
              className={utilStyles.borderCircle}
              height={160}
              width={160}
              alt="Kassaking"/>
        </div>
        <br />
      <section className={utilStyles.center}>
        <p>Zhiyuan Wang</p>
        <p>3B Data Science</p>
        <p>University of Waterloo</p>
      </section>
      <section className={utilStyles.headingMd}>
        <p>Welcome to my personal website!</p>
        <p>I leverage this platform to showcase the insights and inspirations gained from my project developments </p>
        <p>Feel free to explore my projects and discover my passion and proficiency in coding and innovation.</p>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}