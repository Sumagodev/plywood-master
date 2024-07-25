import React, { useEffect, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { MdCall } from "react-icons/md";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { getNameBySlug } from "../services/Category.service";
import { getAllProducts } from "../services/Product.service";
import { generateImageUrl } from "../services/url.service";
import { toastError } from "../utils/toastutill";
import ShopFilter from "./ShopFilter";
import { images } from "./Utility/Images";
import PageBanner from "./Utility/PageBanner";
import { useSelector } from "react-redux";
import Offcanvas from "react-bootstrap/Offcanvas";
import { getAllUsers } from "../services/User.service";
import { BsStarFill } from "react-icons/bs";
import { getWebsiteData } from "../services/websiteData.service";
import ReactPaginate from "react-paginate";
import axios from "axios";
function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  let role = useSelector((state) => state.auth.role);
  const [shopImage, setShopImage] = useState("");
  const [productsArr, setProductsArr] = useState([]);
  const [limit, setLimit] = useState(9);
  const [page, setPage] = useState(1);
  const [totalPages, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  let cancelToken;
  const handleGetProducts = async (cancelTokenValue) => {
    try {
      let query = `role=${role}&perPage=${limit}`;

      if (searchParams && searchParams.toString()) {
        if (!searchParams.toString().includes("page")) {
          query += `&page=${page}`;
        }
        query += `&${searchParams.toString()}`;
      } else {
        query += `&page=${page}`;
      }
      let { data: res } = await getAllUsers(query, cancelTokenValue);
      if (res.data && res?.data?.length > 0) {
        Promise.resolve()
          .then(() => {
            setProductsArr(res?.data);
            setTotal(res?.total);
          })
          .then(() => {
            setIsLoading(false);
          });
      } else {
        Promise.resolve()
          .then(() => {
            setProductsArr([]);
            setTotal(0);
          })
          .then(() => {
            setIsLoading(false);
          });
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(error, "errorerrorerror");
      } else {
        setIsLoading(false);
        toastError(error);
      }
    }
  };

  const handleGetWebsiteData = async () => {
    try {
      let { data: res } = await getWebsiteData("");
      if (res.data) {
        setShopImage(res.data.shopImage);
      }
    } catch (err) {
      toastError(err);
    }
  };

  const handlePageClick = (event) => {
    setSearchParams((searchParams) => {
      searchParams.set("page", event.selected + 1);
      return searchParams;
    });
    setPage(event.selected + 1);
  };
  const getProducts = async () => {
    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel("Cacencel ....");
    }
    // customsearchParams.set("page",`${page}`);

    cancelToken = axios?.CancelToken.source();
    setIsLoading(true);
    // window.scrollTo(0, 0);
    handleGetProducts(cancelToken);
    // }
    return () => cancelToken.cancel("component unmounted");
  };

  useEffect(() => {
    if (searchParams.get("page")) {
      setPage(searchParams.get("page"));
      return;
    }
    handleGetWebsiteData();
  }, []);

  useEffect(() => {
    getProducts();
  }, [page]);

  const handleApplyFilter = () => {
    setSearchParams((searchParams) => {
      searchParams.set("page", 1);
      setPage(1);
      return searchParams;
    });
    getProducts();
  };
  const handleClearFilter = () => {
    getProducts();
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <main>
      <section className="shop-page shoppagepading mb-80 px-4pc mt-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-md-4 col-lg-3 col-xl-3 d-none d-lg-block">
              <ShopFilter
                handleApplyFilter={handleApplyFilter}
                handleClearFilter={handleClearFilter}
              />
            </div>

            <div className="col-12 col-md-12  col-lg-9 col-xl-9">
              <PageBanner
                img={
                  shopImage && shopImage !== ""
                    ? generateImageUrl(shopImage)
                    : images.top_banner
                }
                className="mx-0"
              />
              <ul className="product-name my-4">
                <li>
                  <p className="text-muted">Vendors</p>
                </li>
                <li>
                  <div className="text-muted icon">
                    <BiChevronRight />
                  </div>
                </li>
                {/* <li>
                  <p className="brown">{currentCategoryObj.name}</p>
                </li> */}
              </ul>
              <div className="row gy-5">
                {isLoading == true ? (
                  <div className="col-xl-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      style={{
                        margin: "auto",
                        background: "rgba(241, 242, 243,0)",
                        display: "block",
                      }}
                      width="100px"
                      height="100px"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="xMidYMid"
                    >
                      <g transform="translate(80,50)">
                        <g transform="rotate(0)">
                          <circle
                            cx="0"
                            cy="0"
                            r="6"
                            fill="C21807"
                            fill-opacity="1"
                          >
                            <animateTransform
                              attributeName="transform"
                              type="scale"
                              begin="-0.875s"
                              values="1.5 1.5;1 1"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                            ></animateTransform>
                            <animate
                              attributeName="fill-opacity"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                              values="1;0"
                              begin="-0.875s"
                            ></animate>
                          </circle>
                        </g>
                      </g>
                      <g transform="translate(71.21320343559643,71.21320343559643)">
                        <g transform="rotate(45)">
                          <circle
                            cx="0"
                            cy="0"
                            r="6"
                            fill="C21807"
                            fill-opacity="0.875"
                          >
                            <animateTransform
                              attributeName="transform"
                              type="scale"
                              begin="-0.75s"
                              values="1.5 1.5;1 1"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                            ></animateTransform>
                            <animate
                              attributeName="fill-opacity"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                              values="1;0"
                              begin="-0.75s"
                            ></animate>
                          </circle>
                        </g>
                      </g>
                      <g transform="translate(50,80)">
                        <g transform="rotate(90)">
                          <circle
                            cx="0"
                            cy="0"
                            r="6"
                            fill="C21807"
                            fill-opacity="0.75"
                          >
                            <animateTransform
                              attributeName="transform"
                              type="scale"
                              begin="-0.625s"
                              values="1.5 1.5;1 1"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                            ></animateTransform>
                            <animate
                              attributeName="fill-opacity"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                              values="1;0"
                              begin="-0.625s"
                            ></animate>
                          </circle>
                        </g>
                      </g>
                      <g transform="translate(28.786796564403577,71.21320343559643)">
                        <g transform="rotate(135)">
                          <circle
                            cx="0"
                            cy="0"
                            r="6"
                            fill="C21807"
                            fill-opacity="0.625"
                          >
                            <animateTransform
                              attributeName="transform"
                              type="scale"
                              begin="-0.5s"
                              values="1.5 1.5;1 1"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                            ></animateTransform>
                            <animate
                              attributeName="fill-opacity"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                              values="1;0"
                              begin="-0.5s"
                            ></animate>
                          </circle>
                        </g>
                      </g>
                      <g transform="translate(20,50.00000000000001)">
                        <g transform="rotate(180)">
                          <circle
                            cx="0"
                            cy="0"
                            r="6"
                            fill="C21807"
                            fill-opacity="0.5"
                          >
                            <animateTransform
                              attributeName="transform"
                              type="scale"
                              begin="-0.375s"
                              values="1.5 1.5;1 1"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                            ></animateTransform>
                            <animate
                              attributeName="fill-opacity"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                              values="1;0"
                              begin="-0.375s"
                            ></animate>
                          </circle>
                        </g>
                      </g>
                      <g transform="translate(28.78679656440357,28.786796564403577)">
                        <g transform="rotate(225)">
                          <circle
                            cx="0"
                            cy="0"
                            r="6"
                            fill="C21807"
                            fill-opacity="0.375"
                          >
                            <animateTransform
                              attributeName="transform"
                              type="scale"
                              begin="-0.25s"
                              values="1.5 1.5;1 1"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                            ></animateTransform>
                            <animate
                              attributeName="fill-opacity"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                              values="1;0"
                              begin="-0.25s"
                            ></animate>
                          </circle>
                        </g>
                      </g>
                      <g transform="translate(49.99999999999999,20)">
                        <g transform="rotate(270)">
                          <circle
                            cx="0"
                            cy="0"
                            r="6"
                            fill="C21807"
                            fill-opacity="0.25"
                          >
                            <animateTransform
                              attributeName="transform"
                              type="scale"
                              begin="-0.125s"
                              values="1.5 1.5;1 1"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                            ></animateTransform>
                            <animate
                              attributeName="fill-opacity"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                              values="1;0"
                              begin="-0.125s"
                            ></animate>
                          </circle>
                        </g>
                      </g>
                      <g transform="translate(71.21320343559643,28.78679656440357)">
                        <g transform="rotate(315)">
                          <circle
                            cx="0"
                            cy="0"
                            r="6"
                            fill="C21807"
                            fill-opacity="0.125"
                          >
                            <animateTransform
                              attributeName="transform"
                              type="scale"
                              begin="0s"
                              values="1.5 1.5;1 1"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                            ></animateTransform>
                            <animate
                              attributeName="fill-opacity"
                              keyTimes="0;1"
                              dur="1s"
                              repeatCount="indefinite"
                              values="1;0"
                              begin="0s"
                            ></animate>
                          </circle>
                        </g>
                      </g>
                    </svg>
                  </div>
                ) : (
                  <>
                    {productsArr && productsArr.length > 0 ? (
                      productsArr.map((el, index) => {
                        return (
                          <div
                            key={index}
                            className="col-12 col-lg-4 col-sm-6 col-md-6"
                          >
                            <div className="product-box">
                              <button className="call-btn">
                                <MdCall />
                              </button>
                              {/* <Link to={`/ShopDetail/${el.slug}`}>

                            <img src={images.category_5} alt="" className="img" />
                          </Link> */}
                              <Link to={`/Supplier/${el?._id}`}>
                                {el?.bannerImage ? (
                                  <img
                                    src={generateImageUrl(el?.bannerImage)}
                                    alt=""
                                    className="img"
                                  />
                                ) : (
                                  <img
                                    src={images.category_6}
                                    alt=""
                                    className="img"
                                  />
                                )}
                              </Link>
                              <div className="content">
                                <h6 className="title">
                                  <Link to={`/Supplier/${el?._id}`}>
                                    {el?.companyName
                                      ? el?.companyName
                                      : el?.name}
                                  </Link>
                                </h6>
                                <h6 className="size">
                                  Products:{" "}
                                  {el?.productsCount
                                    ? el?.productsCount
                                    : "N.A."}
                                </h6>
                                <h6 className="size">
                                  Rating:{" "}
                                  <span style={{ marginLeft: 10 }}>
                                    <BsStarFill /> {el?.rating ? el?.rating : 0}
                                  </span>{" "}
                                </h6>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <h4 style={{ color: "grey" }}>
                        No Vendors found for the selected category
                      </h4>
                    )}

                    <div className="col-md-12 text-center" id="react-paginate">
                      <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        breakLabel={<a href="">...</a>}
                        breakClassName={"break-me"}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={totalPages}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        forcePage={page !== 0 ? page - 1 : 0}
                      />{" "}
                      *
                    </div>
                  </>
                )}
                {/* <div className="col-12 col-lg-4">
                  <div className="product-box">
                    <button className="call-btn">
                      <MdCall />
                    </button>
                    <Link to='/ShopDetail'><img src={images.category_6} alt="" className="img" /></Link>
                    <div className="content">
                      <h6 className="title">
                        <Link to='/ShopDetail'>Veneer Boards 18mm Waterproof Wooden Plywood Sheet, 8x4</Link>
                      </h6>
                      <h6 className="size">Size (Sq ft): 8x4</h6>
                      <h6 className="prize">₹60/Sq ft</h6>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="product-box">
                    <button className="call-btn">
                      <MdCall />
                    </button>
                    <Link to='/ShopDetail'><img src={images.category_4} alt="" className="img" /></Link>
                    <div className="content">
                      <h6 className="title">
                        <Link to='/ShopDetail'>Veneer Boards 18mm Waterproof Wooden Plywood Sheet, 8x4</Link>
                      </h6>
                      <h6 className="size">Size (Sq ft): 8x4</h6>
                      <h6 className="prize">₹60/Sq ft</h6>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="product-box">
                    <button className="call-btn">
                      <MdCall />
                    </button>
                    <Link to='/ShopDetail'><img src={images.category_3} alt="" className="img" /></Link>
                    <div className="content">
                      <h6 className="title">
                        <Link to='/ShopDetail'>Veneer Boards 18mm Waterproof Wooden Plywood Sheet, 8x4</Link>
                      </h6>
                      <h6 className="size">Size (Sq ft): 8x4</h6>
                      <h6 className="prize">₹60/Sq ft</h6>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="product-box">
                    <button className="call-btn">
                      <MdCall />
                    </button>
                    <Link to='/ShopDetail'><img src={images.category_2} alt="" className="img" /></Link>
                    <div className="content">
                      <h6 className="title">
                        <Link to='/ShopDetail'>Veneer Boards 18mm Waterproof Wooden Plywood Sheet, 8x4</Link>
                      </h6>
                      <h6 className="size">Size (Sq ft): 8x4</h6>
                      <h6 className="prize">₹60/Sq ft</h6>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="product-box">
                    <button className="call-btn">
                      <MdCall />
                    </button>
                    <Link to='/ShopDetail'><img src={images.category_1} alt="" className="img" /></Link>
                    <div className="content">
                      <h6 className="title">
                        <Link to='/ShopDetail'>Veneer Boards 18mm Waterproof Wooden Plywood Sheet, 8x4</Link>
                      </h6>
                      <h6 className="size">Size (Sq ft): 8x4</h6>
                      <h6 className="prize">₹60/Sq ft</h6>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="product-box">
                    <button className="call-btn">
                      <MdCall />
                    </button>
                    <Link to='/ShopDetail'><img src={images.category_5} alt="" className="img" /></Link>
                    <div className="content">
                      <h6 className="title">
                        <Link to='/ShopDetail'>Veneer Boards 18mm Waterproof Wooden Plywood Sheet, 8x4</Link>
                      </h6>
                      <h6 className="size">Size (Sq ft): 8x4</h6>
                      <h6 className="prize">₹60/Sq ft</h6>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="product-box">
                    <button className="call-btn">
                      <MdCall />
                    </button>
                    <Link to='/ShopDetail'><img src={images.category_6} alt="" className="img" /></Link>
                    <div className="content">
                      <h6 className="title">
                        <Link to='/ShopDetail'>Veneer Boards 18mm Waterproof Wooden Plywood Sheet, 8x4</Link>
                      </h6>
                      <h6 className="size">Size (Sq ft): 8x4</h6>
                      <h6 className="prize">₹60/Sq ft</h6>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="product-box">
                    <button className="call-btn">
                      <MdCall />
                    </button>
                    <Link to='/ShopDetail'><img src={images.category_4} alt="" className="img" /></Link>
                    <div className="content">
                      <h6 className="title">
                        <Link to='/ShopDetail'>Veneer Boards 18mm Waterproof Wooden Plywood Sheet, 8x4</Link>
                      </h6>
                      <h6 className="size">Size (Sq ft): 8x4</h6>
                      <h6 className="prize">₹60/Sq ft</h6>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="product-box">
                    <button className="call-btn">
                      <MdCall />
                    </button>
                    <Link to='/ShopDetail'><img src={images.category_3} alt="" className="img" /></Link>
                    <div className="content">
                      <h6 className="title">
                        <Link to='/ShopDetail'>Veneer Boards 18mm Waterproof Wooden Plywood Sheet, 8x4</Link>
                      </h6>
                      <h6 className="size">Size (Sq ft): 8x4</h6>
                      <h6 className="prize">₹60/Sq ft</h6>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="product-box">
                    <button className="call-btn">
                      <MdCall />
                    </button>
                    <Link to='/ShopDetail'><img src={images.category_2} alt="" className="img" /></Link>
                    <div className="content">
                      <h6 className="title">
                        <Link to='/ShopDetail'>Veneer Boards 18mm Waterproof Wooden Plywood Sheet, 8x4</Link>
                      </h6>
                      <h6 className="size">Size (Sq ft): 8x4</h6>
                      <h6 className="prize">₹60/Sq ft</h6>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
                  <div className="product-box">
                    <button className="call-btn">
                      <MdCall />
                    </button>
                    <Link to='/ShopDetail'><img src={images.category_1} alt="" className="img" /></Link>
                    <div className="content">
                      <h6 className="title">
                        <Link to='/ShopDetail'>Veneer Boards 18mm Waterproof Wooden Plywood Sheet, 8x4</Link>
                      </h6>
                      <h6 className="size">Size (Sq ft): 8x4</h6>
                      <h6 className="prize">₹60/Sq ft</h6>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="filtershowbtn  d-lg-none" onClick={handleShow}>
        Show filter
      </div>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ShopFilter
            handleClose={handleClose}
            handleApplyFilter={handleApplyFilter}
            handleClearFilter={handleClearFilter}
          />

          <p className=" btnmodalfiexed" onClick={() => setShow(false)}>
            Select filter
          </p>
        </Offcanvas.Body>
      </Offcanvas>
    </main>
  );
}

export default Shop;
