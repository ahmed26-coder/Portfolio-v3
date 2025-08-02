import Image from "next/image";
import {getTranslations} from 'next-intl/server';

export async function Footer () {
    const t = await getTranslations('footer');
  const socialLinks = [
    {
      href: "https://wa.me/201016626452",
      title: "Whats app",
      icon: "/whatsapp-svgrepo-com.svg",
      width: 24,
      height: 24,
    },
    {
      href: "https://www.linkedin.com/in/ahmed-adham-479334331/",
      title: "Linkedin",
      icon: "/linkedin-svgrepo-com.svg",
      width: 30,
      height: 30,
    },
    {
      href: "https://github.com/ahmed26-coder",
      title: "github",
      icon: "/github-svgrepo-com.svg",
      width: 24,
      height: 24,
    }
  ];

  return (
    <>
      <footer className="w-full mx-auto sm:px-10 items-center h-fit flex flex-col sm:flex-row sm:flex-wrap justify-between py-[2%] sm:py-[0.5%] bg-gray-100 dark:bg-black text-left">
        <small className="dark:text-[#FFFFFF]/40 text-[#999999] flex gap-0.5 items-center font-play">
          <Image src="/logome6-removebg-preview.webp" alt="Logo" width={30} height={30} priority />
          &copy;2025{" "}
          <span className="text-black dark:text-white text-sm space-x-0.5 font-bold">
            <span>{t('name')}</span><span className="dark:text-[#FFFFFF]/40 text-[#999999]">.{t('role')}</span>
          </span>
        </small>

        <div className="sm:flex hidden items-center flex-col lg:flex-row gap-2 lg:gap-10 mt-2 sm:mt-0">
          <small className="text-black dark:text-white text-sm space-x-0.5 font-play font-bold">
            <span className="dark:text-[#FFFFFF]/40 text-[#999999] font-normal">{t('designed')}</span>
            <span>{t('name')}</span>
          </small>
          <div className=" flex items-center sm:hidden lg:flex gap-4 text-2xl sm:mt-0 mt-3 sm:mx-0 mx-auto">
            {socialLinks.map((item, index) => (
              <a
                aria-label={item.title}
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-150 hover:scale-110"
              >
                <Image src={item.icon} alt={item.title} width={item.width} height={item.height} priority />
              </a>
            ))}
          </div>
        </div>
      </footer>
      <div className=" items-center sm:flex bg-gray-100 dark:bg-black justify-center text-left hidden lg:hidden gap-4 text-2xl pt-1 pb-3 mx-auto">
        {socialLinks.map((item, index) => (
          <a
            aria-label={item.title}
            key={index}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-150 hover:scale-110"
          >
            <Image src={item.icon} alt={item.title} width={item.width} height={item.height} priority />
          </a>
        ))}
      </div>
    </>
  );
};

