import Image from 'next/image'

type Props = {
    path: string
    title: string
    lounge?:string
}

function Hero({path, title, lounge}: Props) {
  return (
      <>
       <section className='h-[40vh] lg:h-[75vh] w-full flex flex-col pt-10 lg:flex-row mb-20 lg:pb-10'>
              <div className='h-full  w-full flex flex-col pb:20 md:mb-1 md:justify-center justify-end items-center  mx-auto '>
                 
                  <div>
                      <h2 className='text-[2rem] md:text-[4rem] items-center justify-center flex lg:tracking-[-0.1rem] w-full lg:leading-[6rem] font-medium gap-4 font-gv '>
                        The Cove <br/> {lounge}
                      </h2>
                  </div>
                  <div className='flex items-start text-[0.8rem] md:text-[1.2rem]'>
                      <h2 className="text-white/50" >{ title}</h2>
                  </div>
              </div>
              <div className='h-[35vh] lg:h-[70vh] w-[85%] mx-auto my-auto  items-center pt-4 justify-center drop-shadow-xl 
              '>
                  <Image src={path} alt="model" height={400} width={400} className='rounded-3xl border-theme-color border-2 object-cover hover:grayscale drop-shadow-xl priority quality = {100}  mx-auto my-auto h-[85%] w-[95%]  ' priority />
              </div>
      </section>
      </>
  )
}

export default Hero
