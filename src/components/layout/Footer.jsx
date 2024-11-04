import FacebookIcon from "../common/FacebookIcon";
import InstaIcon from "../common/InstagramIcon";


const Footer = ({ content }) => {
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
                    <a className="flex flex-col text-[14px] py-2" key={index} href={listItem?.path}>
                      {listItem?.label}
                    </a>
                  ))}
                  {item?.description && <p className="">{item?.description}</p>}
              </div>
            );
          })}
      </div>
      <div className="flex gap-2 items-center justify-center py-4">
          <a href="/fb"><FacebookIcon /></a>
          <a href="/ig"><InstaIcon /></a>
      </div>
      <p className="text-sm text-white text-center content-center">
        {content?.copyright}
      </p>
    </div>
  );
};

export default Footer;
