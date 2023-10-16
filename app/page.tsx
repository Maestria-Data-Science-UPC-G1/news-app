import { Hero } from '@/components'
import News from '@/components/News'
import { Layout } from '@/layout/Layout'
import Image from 'next/image'

export default function Home() {
  return (
    <Layout>
      <News/>
    </Layout>
  )
}
