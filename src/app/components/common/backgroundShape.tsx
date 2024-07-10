import Image from 'next/image';
import React from 'react';

export default function ShapeBackground() {
  return (
    <>    
        <Image
          src={"./images/bottom-shape.svg"}
          alt={"bottom-shape"}
          width={2560}
          height={300}
          sizes="100vw"
          style={{
            width: "2560px",
            height: "auto"
          }}
          className='lg:flex hidden'
        />   
        <Image
          src={"./images/mobile-bg-shape.svg"}
          alt={"bottom-shape"}
          width={2560}
          height={300}
          sizes="100vw"
          style={{
            width: "2560px",
            height: "auto"
          }}
          className='lg:hidden block'
        />
    </>
  )
}