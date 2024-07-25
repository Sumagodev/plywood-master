import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { BsArrowRight } from "react-icons/bs";
import { FaArrowUp, FaHandshake } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { MdCall } from "react-icons/md";
import { RiMessage2Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import banner1 from "../assets/images/banner1.png";
import banner2 from "../assets/images/banner2.jpg";
import banner3 from "../assets/images/banner3.jpg";
import banner4 from "../assets/images/banner4.jpg";
import banner5 from "../assets/images/banner5.jpg";
import banner6 from "../assets/images/banner6.jpg";
import banner7 from "../assets/images/banner7.jpg";
import chkimg from "../assets/images/checkimg.png";

import successgif from "../assets/images/verified.gif";
import { fetchToken } from "../firebase";
import { getForHomepage } from "../services/Advertisement.service";
import { getBrands } from "../services/Banner.service";
import { getBlogApi } from "../services/Blog.service";
import { getBlogVideoApi } from "../services/BlogVideo.service";
import { getNestedCategories } from "../services/Category.service";
import { getAllFlashSales } from "../services/FlashSales.service";
import {
  checkForValidSubscriptionAndReturnBoolean,
  registerUserFcmToken,
} from "../services/User.service";
import { addUserRequirement } from "../services/UserRequirements.service";
import { getHomePageBannersApi } from "../services/homepageBanners.service";
import { generateImageUrl } from "../services/url.service";
import { toastSuccess } from "../utils/toastutill";
import CountdownTimer from "./Utility/CountdownTimer";
import { errorToast } from "./Utility/Toast";

function Index() {
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const [categoryArr, setcategoryArr] = useState([]);
  const [brandArr, setbrandArr] = useState([]);
  const [flashSalesArr, setFlashSalesArr] = useState([]);
  const auth = useSelector((state) => state.auth.user);
  const mainAuthObj = useSelector((state) => state.auth);
  let role = useSelector((state) => state.auth.role);
  const isAuthorized = useSelector((state) => state.auth.isAuthorized);

  const [homepageBannersArr, setHomepageBannersArr] = useState([]);

  const [isDisplayingAll, setIsDisplayingAll] = useState(false);
  const [isMobileNumberVisible, setIsMobileNumberVisible] = useState(false);
  const [
    currentUserHasActiveSubscription,
    setCurrentUserHasActiveSubscription,
  ] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [productName, setProductName] = useState("");
  const [advertisementsArr, setAdvertisementsArr] = useState([]);

  const [signInModal, setSignInModal] = useState(false);

  const getUserFcmToken = async () => {
    try {
      let temp = await fetchToken();
      console.log(temp);
      if (mainAuthObj?.isAuthorized) {
        let { data: res } = await registerUserFcmToken({
          fcmToken: temp,
          userId: mainAuthObj?.user?._id,
        });
        console.log(res, "TOKEN RES");
      }
    } catch (error) {
      // console.error(error);
    }
  };

  useEffect(() => {
    getUserFcmToken();
  }, []);

  useEffect(() => {
    if (auth && auth._id) {
      HandleCheckValidSubscription();
    }
  }, [auth]);
  const HandleCheckValidSubscription = async () => {
    try {
      let { data: res } = await checkForValidSubscriptionAndReturnBoolean(
        auth?._id
      );
      if (res.data) {
        setCurrentUserHasActiveSubscription(res.data);
      }
    } catch (err) {
      // toastError(err)
    }
  };

  const [blogsArr, setBlogsArr] = useState([]);
  const [blogVideoArr, setBlogVideoArr] = useState([]);

  const handleGetBlogs = async () => {
    try {
      let { data: res } = await getBlogApi();
      if (res.data) {
        setBlogsArr(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);

  const handleGetBlogVideo = async () => {
    try {
      let { data: res } = await getBlogVideoApi();
      if (res.data) {
        setBlogVideoArr(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetBlogs();
    handleGetBlogVideo();
  }, []);

  const navigate = useNavigate();

  const handleSubmitRequirement = async (e) => {
    e.preventDefault();
    try {
      if (name == "") {
        errorToast("Name cannot be empty");
        return;
      }
      if (phone == "") {
        errorToast("Mobile number cannot be empty");
        return;
      }
      if (address == "") {
        errorToast("Address cannot be empty");
        return;
      }
      if (productName == "") {
        errorToast("Product cannot be empty");
        return;
      }
      if (!auth || auth._id == "") {
        errorToast("Please login to submit request");
        return;
      }

      let obj = {
        name,
        phone,
        address,
        productName,
        userId: auth._id,
      };
      let { data: res } = await addUserRequirement(obj);
      console.log(res, "====<>");
      if (res.message) {
        toastSuccess(res.message);

        setSignInModal(true);
      }
    } catch (err) {
      // console.log()
      errorToast(err);
    }
  };

  const handleGetFlashSales = async () => {
    try {
      let date = new Date();
      date.setDate(date.getDate() - 1);
      let enddate = `${date.getFullYear()}-${
        (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1)
      }-${(date.getDate() + 1 < 10 ? "0" : "") + date.getDate()}`;
      let { data: res } = await getAllFlashSales("endDate=" + enddate);
      if (res.data) {
        // console.log(res.data, "flash sales");
        setFlashSalesArr(res.data);
      }
    } catch (err) {
      errorToast(err);
    }
  };

  const handleNestedcategories = async () => {
    try {
      let { data: res } = await getNestedCategories();
      if (res.data && res.data?.length > 0) {
        console.log(res.data, "res.data");
        setcategoryArr(res.data.map((el) => ({ ...el, checked: false })));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBrands = async () => {
    try {
      let { data: res } = await getBrands("status=true");
      if (res.data && res.data?.length > 0) {
        setbrandArr(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAdvvertisementForHomepage = async () => {
    try {
      let { data: res } = await getForHomepage();
      if (res.data) {
        console.log(res.data, "data");
        setAdvertisementsArr(res.data);
      }
    } catch (err) {
      errorToast(err);
    }
  };

  const handleGetHomepageBanners = async () => {
    try {
      let { data: res } = await getHomePageBannersApi();
      if (res.data) {
        console.log(res.data, "data");
        setHomepageBannersArr(res.data);
      }
    } catch (err) {
      errorToast(err);
    }
  };

  useEffect(() => {
    handleGetHomepageBanners();
    handleGetAdvvertisementForHomepage();
    handleNestedcategories();
    handleBrands();
    handleGetFlashSales();
  }, []);

  const fretureprod = {
    0: {
      slidesPerView: 2,
    },
    576: {
      slidesPerView: 3,
    },
    992: {
      slidesPerView: 3,
    },
    1200: {
      slidesPerView: 4,
    },
    1400: {
      slidesPerView: 5,
    },
  };
  const findsuppers = {
    0: {
      slidesPerView: 2,
    },
    576: {
      slidesPerView: 3,
    },
    992: {
      slidesPerView: 3,
    },
    1200: {
      slidesPerView: 4,
    },
    1400: {
      slidesPerView: 5,
    },
  };
  const flashsale = {
    0: {
      slidesPerView: 1,
    },
    576: {
      slidesPerView: 2,
    },
    992: {
      slidesPerView: 3,
    },
    1200: {
      slidesPerView: 3,
    },
    1400: {
      slidesPerView: 3,
    },
  };

  const blogbreakpont = {
    0: {
      slidesPerView: 1,
    },
    567: {
      slidesPerView: 2,
    },
    992: {
      slidesPerView: 3,
    },
    1300: {
      slidesPerView: 4,
    },
  };
  const ourvideos = {
    0: {
      slidesPerView: 1,
    },
    567: {
      slidesPerView: 2,
    },
    992: {
      slidesPerView: 3,
    },
    1300: {
      slidesPerView: 4,
    },
  };

  const [showScroll, setShowScroll] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowScroll(true);
    } else {
      setShowScroll(false);
    }
  };

  window.addEventListener("scroll", handleScroll);

  return (
    <main>
      <section className="mb-80">
        <div className="container-fluid">
          <div className="row">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{ disableOnInteraction: false }}
              speed={1500}
              loop
            >
              {homepageBannersArr &&
                homepageBannersArr.length > 0 &&
                homepageBannersArr.map((el, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <div className="col-12">
                        <img
                          src={generateImageUrl(el.image)}
                          alt=""
                          className="img sliderimg"
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
        </div>
      </section>

      <section className="category mb-80">
        <div className="container">
          <div className="title-section with-btn mb-5">
            <h1 className="heading bottom-line brown">Product Categories</h1>
            <Link to="/shop" className="btn btn-custom btn-link-yellow">
              View All
            </Link>
          </div>
        </div>

        <div className="container">
          {/* slice(0,isDisplayingAll ?categoryArr.length : 6) */}
          <ul className="row g-0">
            {categoryArr &&
              categoryArr &&
              categoryArr
                .filter(
                  (el, index) =>
                    index <= (isDisplayingAll ? categoryArr.length - 1 : 5)
                )
                .map((item, index) => {
                  return (
                    <li key={index} className="col-12 col-md-6 col-lg-4">
                      <div className="box">
                        <Link to={`Shop?categories=${item._id}`}>
                          <img src={generateImageUrl(item.image)} alt="" />
                          {/* <img src={chkimg} alt="" /> */}
                        </Link>
                        <div className="text">
                          <Link to={`Shop?categories=${item._id}`}>
                            <h5>{item.name}</h5>
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
          </ul>
          <div className="text-center">
            <button
              className="btn btn-custom btn-yellow mt-2"
              onClick={() => setIsDisplayingAll((prev) => !prev)}
            >
              {isDisplayingAll ? "View Less" : "View All"}
            </button>
          </div>
        </div>
      </section>

      <section className="gray-bg ptb-80 px-4pc">
        <div className="container">
          <div className="title-section with-btn mb-5">
            <h1 className="heading bottom-line brown">New Products</h1>
            {isAuthorized && (
              <Link
                to="/AddPromotions"
                className="btn btn-custom btn-link-yellow"
              >
                Add Products
              </Link>
            )}
          </div>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={5}
            autoplay={{ disableOnInteraction: false }}
            speed={1500}
            breakpoints={fretureprod}
            // loop
          >
            {advertisementsArr &&
              advertisementsArr.map((el, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div className="vender-box">
                      <div className="inner">
                        {el.isVideo ? (
                          <a target="__blank" href={generateImageUrl(el.image)}>
                            <video
                              src={generateImageUrl(el.image)}
                              playsinline
                              autoPlay
                              muted
                              className="img"
                              height={140}
                              width={"100%"}
                            />
                          </a>
                        ) : (
                          <img
                            src={generateImageUrl(el.image)}
                            alt=""
                            className="img"
                          />
                        )}
                        <h6 className="title">{el.message}</h6>
                      </div>
                      <Link
                        to={`/ShopDetail/${el?.productSlug}`}
                        className="btn btn-custom btn-yellow"
                      >
                        Get Quotes
                      </Link>
                    </div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </section>

      {flashSalesArr && flashSalesArr.length > 0 && (
        <section className="flash-sale mb-80 px-4pc gray-bg ptb-80">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-12 col-md-4">
                <div className="flash-sale-box">
                  <div className="title">
                    <h1>FLASH </h1>
                    <h1>SALE</h1>
                  </div>
                  <div className="offer">
                    <h4>Sell your product with </h4>
                    <h4>discounted rate</h4>
                  </div>
                  {isAuthorized && (
                    <Link
                      to="/AddFlashSale"
                      className="btn btn-custom text-white mt-4"
                      style={{
                        borderBottom: "solid 1px white",
                        borderRadius: 1,
                        width: "max-content",
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      Add Flash Sale
                    </Link>
                  )}
                  {/* <CountdownTimer targetDate={dateTimeAfterThreeDays} /> */}
                </div>
              </div>
              <div className="col-12 col-md-8">
                {/* <div className="view-all text-end mb-4">
                <Link to="/" className="btn btn-custom btn-link-yellow">
                  View All
                </Link>
              </div> */}
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={5}
                  autoplay={{ disableOnInteraction: false }}
                  speed={1500}
                  breakpoints={flashsale}
                >
                  {flashSalesArr &&
                    flashSalesArr.length > 0 &&
                    flashSalesArr.map((el, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <div className="product-box-2">
                            <div className="position-relative">
                              <CountdownTimer targetDate={el.endDate} />
                              <Link to={`/ShopDetail/${el?.productId?.slug}`}>
                                <img
                                  src={generateImageUrl(el.productId.mainImage)}
                                  alt=""
                                  className="img"
                                />
                                <div className="overlyasper"></div>
                              </Link>
                              <h6 className="title">
                                <Link to={`/ShopDetail/${el?.productId?.slug}`}>
                                  {el?.productId?.name}
                                </Link>
                              </h6>
                              <ul className="tags">
                                <li>
                                  {el.discountType == "Percentage"
                                    ? `${el.discountValue}% OFF`
                                    : `Flat ${el.discountValue} OFF`}
                                </li>
                              </ul>
                            </div>
                            <div className="d-flex justify-content-center">
                              <h6>{el?.description}</h6>
                            </div>
                            <div className="content">
                              <div>
                                <h6 className="old">
                                  <span className="prize">₹{el?.price}</span>
                                  <span className="small text-muted">
                                    {el.pricetype
                                      ? "/ " + el.pricetype
                                      : "/ Sq ft"}
                                  </span>
                                </h6>
                                <h6 className="new">
                                  <span className="prize">
                                    ₹{el?.salePrice}
                                  </span>
                                  <span className="small text-muted">
                                    {el.pricetype
                                      ? "/ " + el.pricetype
                                      : "/ Sq ft"}
                                  </span>
                                </h6>
                              </div>
                              <button
                                className="call-btn"
                                onClick={() => {
                                  currentUserHasActiveSubscription
                                    ? window.alert(
                                        `${el?.userId?.companyObj?.phone}`
                                      )
                                    : errorToast("Take subscription");
                                }}
                              >
                                <MdCall />
                              </button>
                            </div>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="ptb-80 px-4pc">
        <div className="container">
          <div className="title-section with-btn mb-5">
            <h1 className="heading bottom-line brown">Our Blogs</h1>
            <Link to={`/View/blogs`} className="btn btn-custom btn-link-yellow">
              View All
            </Link>
          </div>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            breakpoints={blogbreakpont}
            autoplay={{ disableOnInteraction: false }}
            speed={1500}
          >
            {blogsArr &&
              blogsArr.length > 0 &&
              blogsArr.map((el, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div>
                      <div className="blog_listing mb-0">
                        <div className="blog_listing_img">
                          <img
                            src={generateImageUrl(el.image)}
                            alt=""
                            className="img-fluid blogImage"
                          />
                        </div>
                        <div className="list_content_blog">
                          <h6>{el?.name}</h6>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: el?.description.slice(0, 100),
                            }}
                          ></div>
                          <Link
                            to={`/blog-detail/${el._id}`}
                            className="btn blog_readmore"
                          >
                            Read More <BsArrowRight className="blog_arrow" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </section>
      <section className=" gray-bg mb-80  ptb-80 px-4pc">
        <div className="container">
          <div className="title-section with-btn mb-5">
            <h1 className="heading bottom-line brown">Our Videos</h1>
            <Link to={`/View/blogs`} className="btn btn-custom btn-link-yellow">
              View All
            </Link>
          </div>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            breakpoints={ourvideos}
            autoplay={{ disableOnInteraction: false }}
            speed={1500}
          >
            {blogVideoArr &&
              blogVideoArr.length > 0 &&
              blogVideoArr.map((el, index) => {
                return (
                  <SwiperSlide key={index}>
                    {el.url && el.url.includes("http") && (
                      <iframe
                        allowFullScreen
                        src={el.url}
                        frameborder="0"
                        className="img-fluid blogImage"
                      ></iframe>
                    )}
                    <h6 className="text-center">{el?.name}</h6>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </section>

      <section className="ptb-80 contact-us">
        <div className="container">
          <div className="row gx-lg-5">
            <div className="col-12 col-md-6">
              <div className="left">
                <h1 className="heading">
                  Get free quotes from multiple sellers
                </h1>
                <ul className="list">
                  <li>
                    <div className="icon">
                      <RiMessage2Line />
                    </div>
                    <h6>
                      Tell us what <br className="d-none d-lg-block" /> You Need
                    </h6>
                  </li>
                  <li>
                    <div className="icon">
                      <GiReceiveMoney />
                    </div>
                    <h6>Receive free quotes from sellers</h6>
                  </li>
                  <li>
                    <div className="icon">
                      <FaHandshake />
                    </div>
                    <h6>Seal The Deal</h6>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="right">
                <h3 className="heading yellow">Tell us your Requirement</h3>
                <form className="form row">
                  <div className="col-12">
                    <label>Name *</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      className="form-control"
                    />
                  </div>
                  <div className="col-12">
                    <label>Mobile No. *</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="tel"
                      className="form-control"
                    />
                  </div>
                  <div className="col-12">
                    <label>Address *</label>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      type="text"
                      className="form-control"
                    />
                  </div>
                  <div className="col-12">
                    <label>Product / Service *</label>
                    <input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      type="text"
                      className="form-control"
                    />
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-custom btn-yellow mt-2"
                      type="button"
                      onClick={(e) => handleSubmitRequirement(e)}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal show={signInModal} centered onHide={() => setSignInModal(false)}>
        <Modal.Body className="sign-in-modal custom-modal">
          <div>
            <img src={successgif} alt="" className="main-logo img-fluid" />
          </div>

          <h1 className="heading">Thank You!</h1>
          <h6>Visiting Again</h6>
          <a className="btn btn-custom btn-yellow mt-2" href="/">
            Go to Home
          </a>
        </Modal.Body>
      </Modal>
    </main>
  );
}

export default Index;
