import { useRouter } from 'next/router';
import React from 'react';

const style = {
  wrapper: `w-min flex items-center rounded-[100px] p-4 cursor-pointer hover:bg-[#333c45] transition-all hover:duration-200 hover:ease-in-out`,
  iconContainer: `text-xl mr-4`,
  textGeneral: `font-medium`,
  textActive: `font-bold`,
};

const SidebarOption = ({
  text,
  Icon,
  isActive,
  setSelected,
  redirect,
}) => {
  const router = useRouter();
  const handleClick = (buttonText = text) => {
    if (buttonText === 'More') {
      setSelected(buttonText);
    } else {
      setSelected(buttonText);
    }
  };
  return (
    <div
      className={style.wrapper}
      onClick={() => {
        handleClick(text);
        if (redirect) {
          router.push(redirect);
        } else return;
      }}
    >
      <div className={style.iconContainer}>
        <Icon />
      </div>
      <div
        className={`${
          isActive ? style.textActive : style.textGeneral
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default SidebarOption;