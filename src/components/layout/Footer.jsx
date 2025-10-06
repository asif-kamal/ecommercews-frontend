import FacebookIcon from "../common/FacebookIcon";
import InstaIcon from "../common/InstagramIcon";
import { Link } from "react-router-dom";

const Footer = ({ content }) => {
  const currentYear = new Date().getFullYear();

  // Replace any year in the copyright text with the current year
  const updatedCopyright = content?.copyright
    ? content.copyright.replace(/©\s*\d{4}/, `© ${currentYear}`)
    : `Copyright © ${currentYear} ecommercews`;

  return (
    <div className="bg-black text-white">
      <div className="flex p-8 justify-around gap-[40px]">
        {content?.items &&
          content?.items?.map((item, index) => {
            return (
              <div className="flex flex-col" key={index}>
                <p className="text-[16px] pb-[10px]">{item?.title}</p>
                {item?.list &&
                  item?.list?.map((listItem, index) => (
                    <Link
                      className="flex flex-col text-[14px] py-2 hover:text-gray-300 transition-colors"
                      key={index}
                      to="/about"
                    >
                      {listItem?.label}
                    </Link>
                  ))}
                {item?.description && <p className="">{item?.description}</p>}
              </div>
            );
          })}
      </div>
      <div className="flex gap-2 items-center justify-center py-4">
        <Link to="/about" className="hover:opacity-75 transition-opacity">
          <FacebookIcon />
        </Link>
        <Link to="/about" className="hover:opacity-75 transition-opacity">
          <InstaIcon />
        </Link>
      </div>
      <p className="text-sm text-white text-center content-center">
        {updatedCopyright}
      </p>
    </div>
  );
};

export default Footer;
