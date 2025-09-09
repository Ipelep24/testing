import Link from 'next/link'
import Time from '../components/Time'
import NewMeeting from '../components/NewMeeting'
import MeetingCode from '../components/MeetingCode'
import Image from 'next/image'
import ToastOnLoad from '../ToastOnLoad'

export default async function Dashboard() {
  //await new Promise(resolve => setTimeout(resolve, 100000))

  return (
    <div className='h-screen font-futura p'>
      <header className='w-full h-1/8'>
        <svg
          className="w-full h-full rotate-180"
          viewBox="0 0 1800 490"
          preserveAspectRatio="none"
        >

          <path
            d="M0,245L26.7,228.7C53.3,212,107,180,160,138.8C213.3,98,267,49,320,98C373.3,147,427,294,480,334.8C533.3,376,587,310,640,253.2C693.3,196,747,147,800,155.2C853.3,163,907,229,960,245C1013.3,261,1067,229,1120,245C1173.3,261,1227,327,1280,334.8C1333.3,343,1387,294,1440,261.3C1493.3,229,1547,212,1600,196C1653.3,180,1707,163,1760,163.3C1813.3,163,1867,180,1920,204.2C1973.3,229,2027,261,2080,253.2C2133.3,245,2187,196,2240,187.8C2293.3,180,2347,212,2400,212.3C2453.3,212,2507,180,2560,196C2613.3,212,2667,278,2720,326.7C2773.3,376,2827,408,2880,408.3C2933.3,408,2987,376,3040,318.5C3093.3,261,3147,180,3200,196C3253.3,212,3307,327,3360,383.8C3413.3,441,3467,441,3520,375.7C3573.3,310,3627,180,3680,130.7C3733.3,82,3787,114,3813,130.7L3840,147L3840,490L3813.3,490C3786.7,490,3733,490,3680,490C3626.7,490,3573,490,3520,490C3466.7,490,3413,490,3360,490C3306.7,490,3253,490,3200,490C3146.7,490,3093,490,3040,490C2986.7,490,2933,490,2880,490C2826.7,490,2773,490,2720,490C2666.7,490,2613,490,2560,490C2506.7,490,2453,490,2400,490C2346.7,490,2293,490,2240,490C2186.7,490,2133,490,2080,490C2026.7,490,1973,490,1920,490C1866.7,490,1813,490,1760,490C1706.7,490,1653,490,1600,490C1546.7,490,1493,490,1440,490C1386.7,490,1333,490,1280,490C1226.7,490,1173,490,1120,490C1066.7,490,1013,490,960,490C906.7,490,853,490,800,490C746.7,490,693,490,640,490C586.7,490,533,490,480,490C426.7,490,373,490,320,490C266.7,490,213,490,160,490C106.7,490,53,490,27,490L0,490Z"
            fill="#384959"
          />
        </svg>
      </header>
      <main className='w-full h-6/8 px-7'>
      <ToastOnLoad />
        <div className='w-full h-full flex'>
          <div className='w-full lg:w-1/2 h-full'>
            <div className='h-1/6'>
              <Time />
            </div>
            <div>
              <h1 className='text-[40px] tracking-wide leading-12 [word-spacing:0.2em]'>Video calls and emotion-aware learning for all.</h1>
            </div>
            <div>
              <h1 className='text-3xl tracking-wide text-gray-500 leading-11'>Engage, interact, and<br /> understand with VirtuSense.</h1>
            </div>
            <div className='flex flex-col h-1/6 xs:items-center xs:flex-row gap-3 my-2'>
              <NewMeeting />
              <MeetingCode />
            </div>
            <hr className='outline outline-[#384959] hidden xs:block border-none' />
            <p className='hidden xs:block text-sm text-gray-600 font-semibold'><Link href='#' className='underline'>Learn more</Link> about Virtusense</p>
          </div>
          <div className='w-1/2 h-full gap-7 flex-col justify-center items-center hidden lg:flex'>
            <Image
              src='/home.jpg'
              alt='Image'
              width={700}
              height={700}
              priority
              className='w-3/4 h-auto'
            />
            <div className='w-2/3'>
              <h1 className='text-center text-2xl font-light'>Host or join a video conference with people around the world</h1>
              <h1 className='text-center text-md text-gray-600'>Join or host virtual meetings with anyone, anywhere.</h1>
            </div>
          </div>
        </div>
      </main>
      <footer className="relative w-full h-1/8 hidden sm:block">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
        >
          <path
            d="M0,210L40,200C80,190,160,170,240,180C320,190,400,230,480,235C560,240,640,210,720,180C800,150,880,120,960,115C1040,110,1120,130,1200,135C1280,140,1360,130,1440,115C1520,100,1600,80,1680,75C1760,70,1840,80,1920,70C2000,60,2080,30,2160,15C2240,0,2320,0,2400,40C2480,80,2560,160,2640,195C2720,230,2800,220,2880,200C2960,180,3040,150,3120,140C3200,130,3280,140,3360,145C3440,150,3520,150,3600,170C3680,190,3760,230,3840,205C3920,180,4000,90,4080,50C4160,10,4240,20,4320,50C4400,80,4480,130,4560,135C4640,140,4720,100,4800,105C4880,110,4960,160,5040,185C5120,210,5200,210,5280,175C5360,140,5440,70,5520,60C5600,50,5680,100,5720,125L5760,150L5760,300L5720,300C5680,300,5600,300,5520,300C5440,300,5360,300,5280,300C5200,300,5120,300,5040,300C4960,300,4880,300,4800,300C4720,300,4640,300,4560,300C4480,300,4400,300,4320,300C4240,300,4160,300,4080,300C4000,300,3920,300,3840,300C3760,300,3680,300,3600,300C3520,300,3440,300,3360,300C3280,300,3200,300,3120,300C3040,300,2960,300,2880,300C2800,300,2720,300,2640,300C2560,300,2480,300,2400,300C2320,300,2240,300,2160,300C2080,300,2000,300,1920,300C1840,300,1760,300,1680,300C1600,300,1520,300,1440,300C1360,300,1280,300,1200,300C1120,300,1040,300,960,300C880,300,800,300,720,300C640,300,560,300,480,300C400,300,320,300,240,300C160,300,80,300,40,300L0,300Z"
            fill="#384959"
          />
        </svg>
      </footer>

    </div>
  )
}
