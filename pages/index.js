import Head from 'next/head';
import Image from 'next/image';
import Feed from '../components/Home/Feed';
import Sidebar from '../components/Sidebar';
import Widgets from '../components/Widgets';

const style = {
  wrapper: `flex justify-center h-screen w-screen select-none bg-[#15202b] text-white`,
  content: `max-w-[1400px] w-3/4 mx-auto flex justify-between`,
};

export default function Home() {
  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <Sidebar />
        <Feed />
        <Widgets />
      </div>
    </div>
  );
}
