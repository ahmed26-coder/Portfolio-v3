import Image from "next/image";

const Footer = () => {
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
      <footer className="fixed bottom-0 left-0 w-full z-50 px-10 items-center h-fit flex flex-col sm:flex-row sm:flex-wrap justify-between py-[2%] sm:py-[0.5%] bg-gray-100 dark:bg-black text-left">
        <small className="dark:text-[#FFFFFF]/40 text-[#999999] flex items-center">
          <Image src="/logome6-removebg-preview.webp" alt="Logo" width={30} height={30} priority={true} />
          &copy;2025 {" "}
          <span className="text-black dark:text-white text-base font-bold">
            <span className="font-play">Ahmed Adham</span><span className="dark:text-[#FFFFFF]/40 text-[#999999]">. Front-End Developer</span>
          </span>
        </small>

        <div className="sm:flex hidden flex-col lg:flex-row gap-2 lg:gap-10 mt-2 sm:mt-0">
          <small className="text-black dark:text-white text-base font-bold">
            <span className="dark:text-[#FFFFFF]/40 text-[#999999] font-normal">Designed & Developed by </span>
            Ahmed Adham
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
                <Image src={item.icon} alt={item.title} width={item.width} height={item.height} />
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
            <Image src={item.icon} alt={item.title} width={item.width} height={item.height} />
          </a>
        ))}
      </div>
    </>
  );
};

export default Footer;
