import Head from "next/head"
import AgeForm from "../components/ageForm"

export default function Index() {
  return <>
  <Head>
    <title>Age Calculator App</title>
    <link rel='icon' href='/images/favicon-32x32.png' />
  </Head>
    <AgeForm />
  </>
}