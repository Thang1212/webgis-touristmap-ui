
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col  justify-center px-6 sm:px-12 w-full h-full lg:bg-black/30 lg:backdrop-blur-sm pt-18 sm:pt-10 lg:pb-0 overflow-ellipsis z-10">
      <p className="text-sm sm:text-lg uppercase tracking-wider text-blue-300">
        Khám phá
      </p>
      
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 mt-2">
        Phan Thiết
      </h1>
      
      <p className="mb-6 max-w-lg text-lg   leading-relaxed text-gray-100 text-[14px] ">
        Phan Thiết – Mũi Né là một trong những khu vực du lịch nổi bật của Việt Nam, 
        được thiên nhiên ưu ái với khí hậu khô ráo, nắng ấm quanh năm. Nơi đây nổi tiếng 
        với bờ biển dài, bãi cát trắng mịn, và là "thủ đô resort" với nhiều khu nghỉ dưỡng cao cấp.
      </p>
      
      <p className="mb-6 max-w-lg text-lg   leading-relaxed text-gray-100 text-[14px]">
        Đến Phan Thiết, du khách sẽ được tận hưởng sự yên bình của biển cả, tham gia 
        các hoạt động thể thao trên biển (như lướt ván buồm, lướt ván diều) và khám phá 
        nét đẹp độc đáo của các đồi cát vàng, đỏ trải dài vô tận.
      </p>
      
      <Link to="/map">
        <button className="bg-blue-500/40 backdrop-blur-sm hover:bg-blue-600/50 active:bg-blue-700/50 px-6 py-3 rounded-full flex items-center gap-2 w-fit transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
          <span>Khám phá ngay</span>
          <span>→</span>
        </button>
      </Link>
    </div>
  );
};

export default Hero;