import Image from 'next/image';
import SidebarFooter from './SidebarFooter';
import SidebarMenu from './SidebarMenu';

export default async function Sidebar() {
  return (
    <nav className="w-fit p-2 shadow-lg">
      <div className='w-full h-1/8'>
        <div className='flex items-center justify-center'>
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className='w-10 h-auto'
          />
          <h1 className='font-futura hidden md:block text-2xl font-bold text-[#64717E] gap-2 p-2'>VirtuSense</h1>
        </div>
      </div>
      <SidebarMenu />
      <SidebarFooter/>
    </nav>
  );
}
