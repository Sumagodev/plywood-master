import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { BsPatchCheckFill } from "react-icons/bs";
import { ImLocation } from "react-icons/im";
import { MdCall } from "react-icons/md";
import ReactStars from "react-rating-stars-component";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { getProductById, getSimilarProducts } from "../services/Product.service";
import { addReview, getReviewForProduct } from "../services/ProductReview.service";
import { checkForValidSubscriptionAndReturnBoolean } from "../services/User.service";
import { addUserRequirement } from "../services/UserRequirements.service";
import { createLead } from "../services/leads.service";
import { generateImageUrl } from "../services/url.service";
import { toastError, toastSuccess } from "../utils/toastutill";
import { images } from "./Utility/Images";
import { errorToast, successToast } from "./Utility/Toast";

function ShopDetail() {
  const [modalOpen, setModalOpen] = useState(false);
  let userObj = useSelector((state) => state.auth.user);
  const auth = useSelector((state) => state.auth);
  const authObj = useSelector((state) => state.auth);
  const [productReviewArr, setProductReviewArr] = useState([]);
  const [rating, setRating] = useState(0);
  const [currentUserHasActiveSubscription, setCurrentUserHasActiveSubscription] = useState(false);
  const [isMobileNumberVisible, setIsMobileNumberVisible] = useState(false);

  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [productName, setProductName] = useState("");

  const [bigImg, setBigImg] = useState(images.category_1);
  const [miniImg, setMiniImg] = useState([images.category_2, images.category_3, images.category_4, images.category_5]);
  const [isPriceVisible, setIsPriceVisible] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [productObj, setproductObj] = useState("");
const [imagearray, setImagearray] = useState([]);
  const [similarProductArr, setSimilarProductArr] = useState([]);
  
  
  const handleGetProductBySlug = async (slug) => {
    try {
      let { data: res } = await getProductById(slug);
      console.log(res.data, "product obj")
      setproductObj(res.data);
      setBigImg(generateImageUrl(res.data.mainImage));
      let imagArr =[];
      if(res.data.mainImage){
        imagArr.push({
          image:res.data.mainImage
        })
      }
      if(res.data.imageArr && res.data.imageArr?.length > 0){
        setImagearray([...imagArr,...res.data.imageArr])
      }
      handleGetProductReview(res.data?._id);
      handleGetSimilarProduct(res.data.categoryId);
    } catch (error) {
      console.log(error);
      errorToast(error);
    }
  };

  const handleGetSimilarProduct = async (id) => {
    try {
      const { data: res } = await getSimilarProducts(id);
      if (res) {
        setSimilarProductArr(res.data);
      }
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    if (slug) {
      handleGetProductBySlug(slug);
    } else {
      navigate("/");
    }
  }, [slug]);

  const [ProductTabs, setProductTabs] = useState([
    {
      name: "Specification",
      active: true,
      tab: "1",
    },
    {
      name: "Description",
      active: false,
      tab: "2",
    },
  ]);
  const [reviewModal, setReviewModal] = useState(false);

  const ActiveTab = (i) => {
    const temp = ProductTabs.map((item, index) => {
      i === index ? (item.active = true) : (item.active = false);
      return item;
    });
    setProductTabs([...temp]);
  };

  const handleSubmitRequirement = async (e) => {
    try {
      if (name == "") {
        throw new Error("Name cannot be empty");
        return;
      }
      if (phone == "") {
        throw new Error("Mobile number cannot be empty");
        return;
      }
      if (address == "") {
        throw new Error("Address cannot be empty");
        return;
      }
      if (productName == "") {
        throw new Error("Product cannot be empty");
        return;
      }

      e.preventDefault();
      let obj = {
        name,
        phone,
        address,
        productName,
        userId: auth?._id,
      };
      let { data: res } = await addUserRequirement(obj);
      if (res.message) {
        toastSuccess(res.message);
        setModalOpen(false);
      }
    } catch (err) {
      errorToast(err);
    }
  };

  const handleCreateLead = async () => {
    try {
      let obj = {
        userId: userObj?._id,
        phone: userObj?.phone,
        email: userObj?.email,
        name: userObj?.name,
        productId: productObj?._id,
        createdById: productObj?.createdById,
      };
      let { data: res } = await createLead(obj);
      if (res.message) {
        successToast(res.message);
      }
    } catch (err) {
      errorToast(err);
    }
  };

  const HandleCheckValidSubscription = async () => {
    try {
      let { data: res } = await checkForValidSubscriptionAndReturnBoolean(userObj?._id)
      if (res.data) {
        setCurrentUserHasActiveSubscription(res.data)
      }
    }
    catch (err) {
      toastError(err)
    }
  }

  const handleSubmitReview = async (e) => {
    try {
      e.preventDefault();
      let obj = {
        rating,
        message,
        name: userName,
        productId: productObj?._id,
      };
      let { data: res } = await addReview(obj);
      if (res.message) {
        toastSuccess(res.message);
        setReviewModal(false);
        handleGetProductReview(productObj?._id)
      }
    } catch (err) {
      toastError(err);
    }
  };

  const handleGetProductReview = async (id) => {
    try {
      let { data: res } = await getReviewForProduct(`productId=${id}`);
      if (res.message) {
        setProductReviewArr(res.data);
      }
    } catch (err) {
      toastError(err);
    }
  };

  const handleConnectNow = async (id) => {
    setModalOpen(true);
  };

  const changeRating = (e) => {
    console.log(e);
    setRating(e);
  };


  useEffect(() => {
    if (userObj && userObj._id) {
      HandleCheckValidSubscription()
    }
  }, [userObj])



  const simiarbreakpoint = {
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
      slidesPerView: 4,
    },
    1400: {
      slidesPerView: 4,
    },
  }









  return (
    <main>
      <section className="product-page mb-80 mt-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-lg-4">
              <div className="left">
                <div className="big-img">
                  <img src={bigImg} alt="" />
                </div>
                <ul className="mini-img">
                  {imagearray &&
                    imagearray.map((item, i) => {
                      return (
                        
                          item?.image &&  item.image != '' && (
                            <li key={i} onClick={() => setBigImg(generateImageUrl(item.image))}>
                          <img src={generateImageUrl(item.image)} alt="" />
                        </li>
                          )
                        
                        
                      );
                    })}
                </ul>
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="mid">
                <h2 className="heading line-height-normal title">{productObj?.name}</h2>
                <ul className="info">
                  {productObj && productObj?.brandObj && (
                    <li>
                      Brand <span className="text-dark">{productObj?.brandObj?.name}</span>
                    </li>
                  )}
                  {productObj?.specification && (
                    <>
                      {productObj?.specification?.thickness && (
                        <li>
                          Thickness <span className="text-dark">{productObj?.specification?.thickness}</span>
                        </li>
                      )}
                      {productObj?.specification?.thickness && (
                        <li>
                          Usage/Application <span className="text-dark">{productObj?.specification?.application}</span>
                        </li>
                      )}
                      {productObj?.specification?.thickness && (
                        <li>
                          Grade <span className="text-dark">{productObj?.specification?.grade}</span>
                        </li>
                      )}

                      {productObj?.specification?.thickness && (
                        <li>
                          Color <span className="text-dark">{productObj?.specification?.color}</span>
                        </li>
                      )}
                    </>
                  )}
                </ul>
                {productObj?.shortDescription && (
                  <div className="desp">
                    {/* <p>{productObj?.shortDescription}</p> */}
                  </div>
                )}
                <div className="btns">
                  {isPriceVisible ? (
                    <div className="btn btn-custom btn-brown rounded-1"> {`INR ${productObj?.sellingprice}`}</div>
                  ) : (
                    <button onClick={() => currentUserHasActiveSubscription ? setIsPriceVisible(true) : errorToast("You do not have a valid subscription to perform this action")} className="btn btn-custom btn-brown rounded-1">
                      Get Latest Price
                    </button>
                    
                  )}
                  {authObj?.isAuthorized && (
                    <button onClick={() => handleCreateLead()} className="btn btn-custom btn-yellow rounded-1">
                      Contact Supplier
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div className="right">
                <div className="d-flex justify-content-between" style={{ position: "relative" }}>

                  <h6 className="heading" onClick={() => currentUserHasActiveSubscription && navigate(`/Supplier/${productObj?.createdByObj?.userObj._id}`)}>{currentUserHasActiveSubscription ?
                    `${productObj?.createdByObj?.userObj?.companyObj?.name ?
                      productObj?.createdByObj?.userObj?.companyObj?.name :
                      "Plywood Bazar"}` :
                    `${productObj?.createdByObj?.userObj?.companyObj?.name ?
                      `${productObj?.createdByObj?.userObj?.companyObj?.name}***` :
                      "Plywood Bazar***"}`
                      .slice(0, 4)}</h6>
                  {
                    productObj?.createdByObj?.userObj?.isVerified &&
                    <img style={{ height: 80, position: "absolute", right: 0 }} src={images.verified} alt="" />
                  }
                </div>
                <ul className="info">
                  <li>
                    {
                      productObj?.createdByObj?.userObj?.profileImage ? (
                        <img src={generateImageUrl(productObj?.createdByObj?.userObj?.profileImage)} alt="" className="img" />
                      ) :
                        (
                          <img src={
                            (productObj?.createdByObj?.userObj?.imagesArr && productObj?.createdByObj?.userObj?.imagesArr.length > 0 && productObj?.createdByObj?.userObj?.imagesArr[0].image) ?
                              generateImageUrl(productObj?.createdByObj?.userObj?.imagesArr[0].image)
                              :
                              images.category_6
                          } alt="" className="img" />)
                    }
                  </li>
                  <li className="flex-1">
                    <p style={{ maxWidth: "75%" }}>
                      <ImLocation className="brown" />
                      {`${currentUserHasActiveSubscription ? (productObj?.createdByObj?.userObj?.companyObj?.address ? productObj?.createdByObj?.userObj?.companyObj?.address : "NA") : (productObj?.createdByObj?.userObj?.companyObj?.address ? `${productObj?.createdByObj?.userObj?.companyObj?.address}***` : "NA").slice(0, 2)}`}
                    </p>
                    {
                      currentUserHasActiveSubscription &&
                      <div className="supplier-rating">
                        <ReactStars edit={false} count={5} size={24} value={parseInt(productObj?.createdByObj?.userObj?.rating)} activeColor="#ffd700" />
                        <p>{productObj?.createdByObj?.userObj?.rating}</p>
                      </div>
                    }

                    <p>
                      <BsPatchCheckFill className="text-success me-2" />
                      GST- {currentUserHasActiveSubscription ? (productObj?.createdByObj?.userObj?.companyObj?.gstNumber ? productObj?.createdByObj?.userObj?.companyObj?.gstNumber : "NA") : ((productObj?.createdByObj?.userObj?.companyObj?.gstNumber ? `${productObj?.createdByObj?.userObj?.companyObj?.gstNumber}***` : "NA").slice(0, 2))}
                    </p>
                  </li>
                </ul>
                <div className="my-3">
                  {isMobileNumberVisible ? (
                    <a href={`tel:${productObj?.createdByObj?.userObj?.companyObj?.phone}`} className="btn btn-sm btn-yellow w-100  ">
                      {productObj?.createdByObj?.userObj?.companyObj?.phone}
                    </a>
                  ) : (
                    <button onClick={() => { currentUserHasActiveSubscription ? setIsMobileNumberVisible(true) : errorToast("You do not have a valid subscription to perform this action") }} className="btn btn-sm btn-yellow w-100">
                      View Mobile Number
                    </button>
                  )}
                  {/* <p className="text-danger">72% Response Rate</p> */}
                </div>
                <ul className="list-circle border-bottom pb-3 mb-3">
                  {/* {
                    productObj?.createdByObj?.userObj?.isVerified &&
                    <img src={images.verified} style={{ width: 130 }} alt="" />
                  } */}

                  {/* <li>Leading Supplier</li>
                  <li>TrustSEAL Verified</li>
                  <li>Distributor / Channel Partner</li> */}
                  {/* <li>Company Video</li> */}
                </ul>
                <h6 className="heading text-center">Looking for more Verified Exporters?</h6>
                <button onClick={() => handleConnectNow()} className="btn btn-sm btn-brown w-100">
                  Connect Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-tabs mb-80">
        <div className="container">
          <ul className="tabs">
            {ProductTabs.map((item, i) => {
              return (
                <li className={item.active ? "active" : ""} key={i} onClick={() => ActiveTab(i)}>
                  {item.name}
                </li>
              );
            })}
          </ul>
          <div className="tab-description">
            {ProductTabs.map((item, i) => {
              if (item.active && item.tab === "1") {
                return (
                  <div className="tab-inner">
                    <ul className="info">
                      {productObj && productObj?.brandObj && (
                        <li>
                          Brand <span className="text-dark">{productObj?.brandObj?.name}</span>
                        </li>
                      )}
                      {productObj?.specification && (
                        <>
                          {productObj?.specification?.thickness && (
                            <li>
                              Thickness <span className="text-dark">{productObj?.specification?.thickness ? productObj?.specification?.thickness : "NA"}</span>
                            </li>
                          )}
                          {productObj?.specification?.thickness && (
                            <li>
                              Usage/Application <span className="text-dark">{productObj?.specification?.application ? productObj?.specification?.application : "NA"}</span>
                            </li>
                          )}
                          {productObj?.specification?.thickness && (
                            <li>
                              Grade <span className="text-dark">{productObj?.specification?.grade ? productObj?.specification?.grade : "NA"}</span>
                            </li>
                          )}

                          {productObj?.specification?.thickness && (
                            <li>
                              Color <span className="text-dark">{productObj?.specification?.color ? productObj?.specification?.color : "NA"}</span>
                            </li>
                          )}

                          {productObj?.specification?.thickness && (
                            <li>
                              Wood Type <span className="text-dark">{productObj?.specification?.wood ? productObj?.specification?.wood : "NA"}</span>
                            </li>
                          )}

                          {productObj?.specification?.thickness && (
                            <li>
                              Glue Used <span className="text-dark">{productObj?.specification?.glue ? productObj?.specification?.glue : "NA"}</span>
                            </li>
                          )}
                          {productObj?.specification?.thickness && (
                            <li>
                              Warranty <span className="text-dark">{productObj?.specification?.warranty ? productObj?.specification?.warranty : "NA"}</span>
                            </li>
                          )}
                        </>
                      )}
                    </ul>
                  </div>
                );
              }
              if (item.active && item.tab === "2") {
                return (
                  <div className="tab-inner">
                    {productObj?.longDescription && (
                      <div className="desp">
                        {/* <p>{productObj?.longDescription}</p> */}
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </section>

      <section className="products mb-80 gray-bg ptb-80">
        <div className="container">
          <div className="title-section with-btn">
            <h1 className="heading bottom-line brown">Similar Products</h1>
            {/* <Link to="/" className="btn btn-custom btn-yellow">
              View All
            </Link> */}
          </div>
          <Swiper
            spaceBetween={20}
            slidesPerView={4}
            breakpoints={simiarbreakpoint}
            speed={1500}
            modules={[Autoplay, Navigation]}
            autoplay={{ disableOnInteraction: false }}
            navigation className="pt-5 px-4">
            {similarProductArr &&
              similarProductArr.length > 0 &&
              similarProductArr.map((el) => {
                return (
                  <SwiperSlide>
                    <div className="product-box">
                      <button className="call-btn">
                        <MdCall />
                      </button>
                      <Link to={`/ShopDetail/${el?.slug}`}>{el?.mainImage ? <img src={generateImageUrl(el?.mainImage)} alt="" className="img" /> : <img src={images.category_5} alt="" className="img" />}</Link>
                      <div className="content">
                        <h6 className="title">
                          <Link to={`/ShopDetail/${el?.slug}`}>{el.name}</Link>
                        </h6>
                        <h6 className="size">Size (Sq ft): {el?.specification?.size ? el?.specification?.size : "N.A."}</h6>
                        <h6 className="prize">₹{el.sellingprice}/Sq ft</h6>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </section>

      {/* <section className="mb-80">
        <div className="container">
          <div className="title-section with-btn mb-5">
            <h1 className="heading bottom-line brown">Reviews</h1>
            {auth?.isAuthorized && (
              <Link to="#" className="btn btn-custom btn-yellow" onClick={() => setReviewModal(true)}>
                Write a review
              </Link>
            )}
          </div>
          <div className="row gy-4">
            {productReviewArr && productReviewArr.length > 0 ? (
              productReviewArr.map((el, index) => {
                return (
                  <div key={index} className="col-12">
                    <div className="product-review">
                      <div className="top">
                        <div className="name">
                          <div>
                            <h6>{el.name}</h6>
                            <p className="small brown">{moment(el.createdAt).format("DD-MM-YYYY")}</p>
                          </div>
                        </div>
                        <div className="review-rating">
                          <ReactStars edit={false} count={5} size={24} value={el.rating} activeColor="#ffd700" />
                        </div>
                      </div>
                      <div className="desp">
                        <p>
                          {el.message} {el.rating}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12">
                <div className="product-review">
                  <div className="top">
                    <div className="name">
                      <div>
                        <h6>No Reviews found for this product</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section> */}

      <Modal show={reviewModal} size="lg" centered onHide={() => setReviewModal(false)}>
        <Modal.Body className="review-modal custom-modal">
          <button type="button" class="btn-close right" aria-label="Close" onClick={() => setReviewModal(false)}></button>
          <h3 className="heading brown my-2">Review Us</h3>
          <form className="form row">
            <div className="col-12 col-md-6">
              <label>Name</label>
              <input onChange={(e) => setUserName(e.target.value)} value={userName} type="text" className="form-control" />
            </div>
            <div className="col-12 col-md-6">
              <label>Rating</label>
              <StarRatings rating={rating} starRatedColor="orange" starHoverColor="orange" changeRating={changeRating} numberOfStars={5} starDimension="28px" starSpacing="2px" name="rating" />
              {/* <input type="number" className="form-control" /> */}
            </div>
            <div className="col-12">
              <label>Comment</label>
              <textarea onChange={(e) => setMessage(e.target.value)} value={message} rows="5" className="form-control"></textarea>
            </div>
            <div className="col-12">
              <button
                onClick={(e) => {
                  handleSubmitReview(e);
                }}
                className="btn btn-custom text-white yellow-bg py-2"
              >
                Submit
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={modalOpen} size="lg" centered onHide={() => setModalOpen(false)}>
        <Modal.Body className="review-modal custom-modal">
          <button type="button" class="btn-close right" aria-label="Close" onClick={() => setModalOpen(false)}></button>
          <h3 className="heading yellow">Tell us your Requirement</h3>
          <form className="form row">
            <div className="col-12">
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" />
            </div>
            <div className="col-12">
              <label>Mobile No.</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="form-control" />
            </div>
            <div className="col-12">
              <label>Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} type="text" className="form-control" />
            </div>
            <div className="col-12">
              <label>Product / Service</label>
              <input value={productName} onChange={(e) => setProductName(e.target.value)} type="text" className="form-control" />
            </div>
            <div className="col-12">
              <button className="btn btn-custom btn-yellow mt-2" onClick={(e) => handleSubmitRequirement(e)}>
                Submit
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </main>
  );
}

export default ShopDetail;
