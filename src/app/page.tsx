import Image from 'next/image'
import React from 'react'

const Page = () => {
  return (
    <div>
      <Image src={"/Evix.png"} alt='Evix' height={200} width={500} />
      Hello
    </div>
  )
}

export default Page