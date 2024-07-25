import { debounce } from "lodash";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { AiFillHome, AiOutlineLogout, AiTwotoneSetting } from "react-icons/ai";
import { BiBell, BiChevronDown, BiSearch } from "react-icons/bi";
import { FaUserCheck } from "react-icons/fa";
import { GrProductHunt } from "react-icons/gr";
import {
  MdLocalOffer,
  MdOutlineSubscriptions,
  MdSportsEsports,
  MdSubscriptions,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  NavLink,
  redirect,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  login,
  logoutUser,
  otpSend,
} from "../../redux/features/auth/authSlice";
import { getNestedCategories } from "../../services/Category.service";
import {
  getUserNotifications,
  searchVendorFromDb,
  sentOtp,
} from "../../services/User.service";
import { getDecodedToken, getToken } from "../../services/auth.service";
import { toastError, toastSuccess } from "../../utils/toastutill";
import { images } from "../Utility/Images";
import { errorToast, successToast } from "../Utility/Toast";
import { FaBell } from "react-icons/fa";

// import Container from "react-bootstrap/Container";
// import Offcanvas from "react-bootstrap/Offcanvas";
// import Nav from "react-bootstrap/Nav";

function Header() {
  const dispatch = useDispatch();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const userObj = useSelector((state) => state.auth.user);
  const tempLoginObj = useSelector((state) => state.auth.tempLoginObj);
  let role = useSelector((state) => state.auth.role);
  const ref = useRef();
  const location = useLocation();
  const [showcatgoryNav, setShowcatgoryNav] = useState(true);
  const [searchBy, setSearchBy] = useState(false);
  const [searchType, setSearchType] = useState("vendor");
  const [searchList, setSearchList] = useState([
    { name: "search by keyword", checked: true, type: "vendor" },
    { name: "Search By Product", checked: false, type: "product" },
  ]);

  const [searchText, setSearchText] = useState("");
  const [signInList, setSignInList] = useState([
    {
      name: "Profile",
      icon: <AiFillHome />,
      link: "/My-Profile",
    },
    // {
    //   name: "Post Your Requiement",
    //   icon: <GiPostOffice />,
    //   link: "/",
    // },
    {
      name: "My Products",
      icon: <GrProductHunt />,
      link: "/MyProducts",
    },
    // {
    //   name: "Verified Business Buyer",
    //   icon: <FaUserCheck />,
    //   link: "/",
    // },
    // {
    //   name: "Products/Services Directory",
    //   icon: <MdOutlineDocumentScanner />,
    //   link: "/",
    // },
    // {
    //   name: "My Orders",
    //   icon: <AiFillGift />,
    //   link: "/",
    // },
    {
      name: "My Leads",
      icon: <FaUserCheck />,
      link: "/MyLeads",
    },
    {
      name: "My Subscriptions",
      icon: <MdOutlineSubscriptions />,
      link: "/MySubscriptions",
    },
    // {
    //   name: "Subscription",
    //   icon: <MdSubscriptions />,
    //   link: "/Subscription",
    // },
    {
      name: "Topup",
      icon: <MdSubscriptions />,
      link: "/Topup",
    },
    {
      name: "Recent Activity",
      icon: <MdSportsEsports />,
      link: "/Recent-Activities",
    },
    {
      name: "My Flash-Sales",
      icon: <MdLocalOffer />,
      link: "/View/My-FlashSales",
    },
    {
      name: "My Promotions",
      icon: <MdLocalOffer />,
      link: "/View/My-Promotions",
    },
    {
      name: "Notifications",
      icon: <AiTwotoneSetting />,
      link: "/notifications",
    },
  ]);
  const [showSignIn, setShowSignIn] = useState(false);
  const [displaySearchResults, setDisplaySearchResults] = useState(false);
  const [searchResultArr, setSearchResultArr] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [loginByEmail, setLoginByEmail] = useState(false);

  const [email, setEmail] = useState("");
  const [otpsent, setotpsent] = useState(false);
  const [totalNotification, settotalNotification] = useState(0);
  const [signInModal, setSignInModal] = useState(false);
  const [mobile, setmobile] = useState("");
  const [otp, setotp] = useState("");
  const navigate = useNavigate();
  const [countryList, setCountryList] = useState([
    {
      img: images.country_1,
      prefix: "+91",
      active: true,
    },
    {
      img: images.country_2,
      prefix: "+92",
      active: false,
    },
    {
      img: images.country_3,
      prefix: "+93",
      active: false,
    },
  ]);
  const [showCountry, setShowCountry] = useState(false);
  const [currentCountry, setCurrentCountry] = useState({
    img: countryList[0].img,
    prefix: countryList[0].prefix,
  });
  const [countryTimeout, setCountryTimeout] = useState(null);
  const [categoryArr, setcategoryArr] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const isAuthorized = useSelector((state) => state.auth.isAuthorized);

  const [name, setname] = useState();

  const handleNestedcategories = async () => {
    try {
      let { data: res } = await getNestedCategories();
      if (res.data) {
        setcategoryArr(res.data.map((el) => ({ ...el, checked: false })));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetProducts = async (skipValue, limitValue, searchQuery) => {
    try {
      let query = `?page=${skipValue}&perPage=${limitValue}&userId=${userObj?._id}&isRead=false`;
      let { data: res } = await getUserNotifications(query);
      console.log(
        res.totalElements,
        "res.totalElementsres.totalElementsres.totalElementsres.totalElements"
      );

      if (res.data) {
        settotalNotification(res.totalElements);
      }
    } catch (err) {
      errorToast(err);
    }
  };
  const handleRegister = () => {
    setSignInModal(false);
    return redirect("/Register");
  };

  const handleGetUser = async () => {
    let decodedToken = await getDecodedToken();
    let user = decodedToken?.userData?.user;
    if (user) {
      setname(user.name);
    }
  };

  useEffect(() => {
    setSignInModal(false);
    handleNestedcategories();
    if (getToken()) {
      handleGetUser();
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (userObj && userObj?._id) {
      handleGetProducts();
    }
  }, [userObj]);

  const handlesendOtp = async () => {
    try {
      if (loginByEmail) {
        if (`${email}` === "") {
          errorToast("Please Enter email");
          return;
        }
        if (!`${email}`.includes("@")) {
          errorToast("Please Enter a valid email");
          return;
        }
        if (!`${email}`.includes(".")) {
          errorToast("Please Enter a valid email");
          return;
        }
      } else {
        if (`${mobile}`.length !== 10) {
          errorToast("Please Enter Mobile Number");
          return;
        }
      }
      let obj = {
        phone: mobile,
        email: email,
      };

      // console.log(obj,"gdfgdkfdgfadfdfdkjdhfjkdafhfdkjkskjafhdkjhsjk",)
      // dispatch(otpSend(obj));
      // setotpsent(true);

      let { data: res } = await sentOtp(obj);
      if (res.message) {
        successToast(res.message);
        setotpsent(true);
      }
    } catch (error) {
      errorToast(error);
      console.log(error);
    }
  };

  const resendOtp = async () => {
    try {
      if (`${mobile}` === "") {
        errorToast("Please Enter Mobile Number");
        return;
      }

      let obj = {
        phone: mobile,
        // email: email,
      };

      // dispatch(otpSend(obj));

      let { data: res } = await sentOtp(obj);
      if (res.message) {
        successToast(res.message);
        // setotpsent(true)
      }
    } catch (error) {
      errorToast(error);
      console.log(error);
    }
  };

  useEffect(() => {
    if (tempLoginObj) {
      if (tempLoginObj && tempLoginObj.isOtpSent) {
        // setotpsent(true);
      }
    }
  }, [tempLoginObj]);

  const handlesLogin = async () => {
    if (`${otp}` === "") {
      errorToast("Please Enter Otp");
      return;
    }
    let obj = {
      phone: mobile,
      otp,
    };
    dispatch(login(obj));
    setSignInModal(false);
  };

  const handleLogout = () => {
    // deleteToken()
    dispatch(logoutUser());
    setotp("");
    setmobile("");
    setotpsent(false);

    // setIsAuthorized(false)
  };

  const handleSearchText = (value) => {
    setSearchText(value);
    debounceSearch(value);
  };
  const debounceSearch = useCallback(
    debounce((nextVal) => handleSearchFromDb(nextVal), 1000),
    [searchType]
  );

  const handleSearchFromDb = async (value) => {
    try {
      console.log(searchType, "handleSearchText");

      if (value != "") {
        const { data: res } = await searchVendorFromDb(
          `search=${value}&role=${role}`
        );
        if (res) {
          console.log(res.data, "handleSearchText vendor");
          setShowSearchBar(true);
          setSearchResultArr(res.data);
        } else {
          setShowSearchBar(true);
          setDisplaySearchResults([]);
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  const checkSearchMode = () => {
    return searchList.find((el) => el.checked)?.name;
  };

  useEffect(() => {
    if (searchList.some((el) => el.checked)) {
      console.log(checkSearchMode());
    }
  }, [showSearchBar, searchList]);

  const handleCheckItem = (obj) => {
    let tempArr = searchList.map((el) => {
      if (el.name == obj.name) {
        el.checked = true;
      } else {
        el.checked = false;
      }

      return el;
    });
    setSearchText("");
    setSearchType(obj.type);
    setSearchList([...tempArr]);
    setSearchResultArr([]);
  };

  useEffect(() => {
    console.log(searchType, "searchVendor ");
  }, [searchType]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const pickerRef = useRef(null);
  const pickerRef1 = useRef(null);

  useLayoutEffect(() => {
    window.addEventListener("resize", function updateSize() {
      setWindowWidth(window.innerWidth);
    });
    setWindowWidth(window.innerWidth);
    return () =>
      window.removeEventListener("resize", function updateSize() {
        setWindowWidth(window.innerWidth);
      });
  }, [window]);

  useEffect(() => {
    if (
      pickerRef.current !== null &&
      pickerRef1.current !== null &&
      pickerRef.current.input &&
      pickerRef1.current.input
    ) {
      if (windowWidth > 992) {
        pickerRef.current.input.readOnly = false;
      } else {
        pickerRef.current.input.readOnly = true;
      }
      if (windowWidth > 992) {
        pickerRef1.current.input.readOnly = false;
      } else {
        pickerRef1.current.input.readOnly = false;
      }
    }
    console.log("asd");
  }, [windowWidth, pickerRef, pickerRef1]);

  useEffect(() => {
    if (searchParams.get("loginTriggered")) {
      setSignInModal(true);
      setSearchParams((prev) => console.log(prev, "prev"));
    }
  }, [searchParams.get("loginTriggered")]);

  const wrapperRef = useRef(null);
  const wrapperLoggedOutRef = useRef(null);

  useEffect(() => {
    function handleClickOutsideLoggedOut(event) {
      if (
        wrapperLoggedOutRef.current &&
        !wrapperLoggedOutRef.current.contains(event.target)
      ) {
        setShowSignIn(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideLoggedOut);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideLoggedOut);
    };
  }, [wrapperLoggedOutRef, wrapperLoggedOutRef.current]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSignIn(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, wrapperRef.current]);

  const [navbartollge, setNavbartollge] = useState(false);
  const toggleOffCanvas = () => {
    setNavbartollge((navbartollge) => !navbartollge);
  };

  const handleCheckCategory = (categoryObj) => {
    let tempArr = categoryArr.map((el) => {
      let obj = {
        ...el,
        checked: el._id == categoryObj._id,
      };
      return obj;
    });

    setcategoryArr([...tempArr]);
    setActiveCategory(categoryObj._id);
  };

  const [megamenu, setMegamenu] = useState(false);

  const wrapper2Ref = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapper2Ref.current && !wrapper2Ref.current.contains(event.target)) {
        setcategoryArr((prev) => [
          ...prev.map((el) => ({ ...el, checked: false })),
        ]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapper2Ref, wrapper2Ref.current]);

  useEffect(() => {
    if (location.pathname == "/") {
      setShowcatgoryNav(true);
      setmobileshowmenu(false);
    } else {
      setShowcatgoryNav(false);
      setmobileshowmenu(true);
    }
    console.log(location, "navigation");
  }, [location]);

  const [mobileshowmenu, setmobileshowmenu] = useState(false);

  return (
    <>
      <header className="reverheadermobile sticky-top bg-light">
        <div className="topbar bg-dark d-none">
          <Container fluid>
            <ul>
              <li>
                <p>
                  Call us toll free:&nbsp;
                  <a href="tel:+1-541-754-3010">+1-541-754-3010</a>
                </p>
              </li>
              <li>
                <p>|</p>
              </li>
              <li>
                <p>
                  Send us an email:&nbsp;
                  <a href="mailto:contact@example.com">contact@example.com</a>
                </p>
              </li>
            </ul>
          </Container>
        </div>

        <div className="middlebar_new">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-4">
                <Link to="/" className="navbar-brand d-lg-block d-none">
                  <img
                    src={images.logo}
                    alt=""
                    className="main-logo img-fluid"
                  />
                </Link>
              </div>
              <div className="col-lg-8 col-12">
                <div className="middlebody">
                  <div className="row align-items-center">
                    <div className="col-8 col-lg-6">
                      {windowWidth > 992 ? (
                        <>
                          <form
                            className="search-bar"
                            // onFocus={() => setShowSearchBar(true)}
                          >
                            <div
                              className="custom-search"
                              // onFocus={() => {
                              //   setSearchBy(!searchBy);
                              // }}
                              onClick={() => {
                                setSearchBy(!searchBy);
                              }}
                              // onBlur={() => setSearchBy(!searchBy)}
                            >
                              <button
                                className="yellow-bg btn text-white h-100 rounded-0"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate("/Shop");
                                }}
                              >
                                Search
                              </button>
                              {/* <ul style={{ display: searchBy ? "block" : "none" }} className={`custom-search-list`}>
                                {searchList.map((item, i) => {
                                  return (
                                    <li key={i} onClick={() => { handleCheckItem(item); setSearchBy(!searchBy) }}>
                                      <label className="pointer">
                                        <input type="radio" checked={item.checked} className="form-check-input" name="header-search-by" />
                                        {item.name}
                                      </label>
                                    </li>
                                  );
                                })}
                              </ul> */}
                            </div>
                            <div className="form-control flex-1">
                              <input
                                type="search"
                                placeholder={checkSearchMode()}
                                aria-label="Search"
                                value={searchText}
                                onChange={(e) =>
                                  handleSearchText(e.target.value)
                                }
                              />
                              <div className="icon">
                                <BiSearch />
                              </div>
                            </div>
                            {searchText != "" && showSearchBar && (
                              <div className="searchBox listsearch">
                                <div
                                  className="searchBoxCloseIcon"
                                  onClick={() => {
                                    setShowSearchBar(false);
                                  }}
                                >
                                  X
                                </div>
                                {searchResultArr &&
                                searchResultArr.length > 0 ? (
                                  searchResultArr.map((el, index) => {
                                    return (
                                      <div key={index}>
                                        <Link
                                          to={`/Supplier/${el?._id}`}
                                          onClick={() =>
                                            setShowSearchBar(false)
                                          }
                                          onFocus={() => setShowSearchBar(true)}
                                        >
                                          <p>{el?.companyObj?.name}</p>
                                        </Link>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div>
                                    {/* <Link to={`/ShopDetail/${el?.slug}`} onFocus={() => setShowSearchBar(true)}> */}
                                    <p>No results found</p>
                                    {/* </Link> */}
                                  </div>
                                )}
                              </div>
                            )}
                          </form>
                        </>
                      ) : (
                        <>
                          <form
                            className="search-bar"
                            onClick={() => {
                              setSearchBy(!searchBy);
                            }}
                            onFocus={() => setShowSearchBar(true)}
                          >
                            <div
                              className="custom-search mobileserach "
                              // onFocus={() => {
                              //   setSearchBy(!searchBy);
                              // }}
                              // onClick={() => {
                              //   setSearchBy(!searchBy);
                              // }}
                              // onBlur={() => setSearchBy(!searchBy)}
                            >
                              <button
                                className="yellow-bg btn text-white h-100 rounded-0"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate("/Shop");
                                }}
                                // onClick={(e) => {
                                //   e.preventDefault();
                                //   setSearchBy(!searchBy);
                                // }}
                              >
                                Search
                                {/* <BiChevronDown /> */}
                              </button>
                              {/* <ul style={{ display: searchBy ? "block" : "none" }} className={`custom-search-list`}>
                                  {searchList.map((item, i) => {
                                    return (
                                      <li key={i} onClick={() => { handleCheckItem(item); setSearchBy(!searchBy) }}>
                                        <label className="pointer">
                                          <input type="radio" checked={item.checked} className="form-check-input" name="header-search-by" />
                                          {item.name}
                                        </label>
                                      </li>
                                    );
                                  })}
                                s</ul> */}
                            </div>
                            <div className="form-control flex-1">
                              <input
                                type="search"
                                placeholder={checkSearchMode()}
                                aria-label="Search"
                                value={searchText}
                                onChange={(e) =>
                                  handleSearchText(e.target.value)
                                }
                              />
                              <div className="icon">
                                <BiSearch />
                              </div>
                            </div>
                            {searchText != "" && showSearchBar && (
                              <div className="searchBox listsearch">
                                <div
                                  className="searchBoxCloseIcon"
                                  onClick={() => {
                                    setShowSearchBar(false);
                                  }}
                                >
                                  X
                                </div>
                                {searchResultArr &&
                                searchResultArr.length > 0 ? (
                                  searchResultArr.map((el, index) => {
                                    return (
                                      <div key={index}>
                                        <Link
                                          to={`/Supplier/${el?._id}`}
                                          onClick={() =>
                                            setShowSearchBar(false)
                                          }
                                          onFocus={() => setShowSearchBar(true)}
                                        >
                                          <p>{el?.companyObj?.name}</p>
                                        </Link>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div>
                                    {/* <Link to={`/ShopDetail/${el?.slug}`} onFocus={() => setShowSearchBar(true)}> */}
                                    <p>No results found</p>
                                    {/* </Link> */}
                                  </div>
                                )}
                              </div>
                            )}
                          </form>
                        </>
                      )}
                    </div>
                    <div className="col-4 col-lg-6">
                      <div className="flex_row d-flex mobile_right">
                        {windowWidth > 992 ? (
                          <>
                            <Nav>
                              <NavLink className="nav-link" to="/">
                                Home
                              </NavLink>

                              <NavLink
                                className="nav-link"
                                to="/View/My-Tickets"
                              >
                                Help
                              </NavLink>

                              <NavLink className="nav-link" to="/View/blogs">
                                Blogs
                              </NavLink>
                              {isAuthorized && (
                                <a
                                  className="nav-link position-relative"
                                  href="/notifications"
                                >
                                  <FaBell style={{ fontSize: 22 }} />
                                  {totalNotification > 0 && (
                                    <span>{totalNotification}</span>
                                  )}
                                </a>
                              )}
                            </Nav>
                          </>
                        ) : (
                          ""
                        )}

                        {isAuthorized ? (
                          <div
                            className="sign-in-btn"
                            // onClick={(e) => {
                            //   alert('12asdf')
                            //   e.preventDefault();
                            // }}
                          >
                            <div
                              className="custom-search"
                              // onFocus={() => setShowSignIn(!showSignIn)}
                              // onBlur={() => setShowSignIn(!showSignIn)}
                              onClick={() => setShowSignIn(!showSignIn)}
                            >
                              <button
                                className="text-dark d-flex align-items-center"
                                // onClick={(e) => {
                                //   alert('12asdf')
                                //   e.preventDefault();
                                // }}
                              >
                                <img src={images.user} alt="" />
                                {userObj?.name}
                                <BiChevronDown />
                              </button>
                              <div ref={wrapperRef}>
                                <ul
                                  style={{
                                    display: showSignIn ? "block" : "none",
                                  }}
                                  className={`custom-search-list`}
                                >
                                  {signInList.map((item, i) => {
                                    return (
                                      <li key={i}>
                                        <Link to={item.link}>
                                          <div className="icon">
                                            {item.icon}
                                          </div>
                                          {item.name}
                                        </Link>
                                      </li>
                                    );
                                  })}

                                  <li onClick={() => handleLogout()}>
                                    <a style={{ cursor: "pointer" }}>
                                      <div className="icon">
                                        <AiOutlineLogout />
                                      </div>
                                      Logout
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="sign-in-btn"
                            onClick={() => setShowSignIn(!showSignIn)}
                            // onFocus={() => setShowSignIn(!showSignIn)}
                            //  onBlur={() => setShowSignIn(!showSignIn)}

                            // onClick={(e) => {
                            //   alert('12asdf')
                            //   e.preventDefault();
                            // }}
                          >
                            <div className="custom-search">
                              <button
                                className="text-dark d-flex align-items-center"
                                onClick={(e) => {
                                  e.preventDefault();
                                }}
                              >
                                {windowWidth > 992 ? (
                                  <>
                                    <img src={images.user} alt="" /> Log In{" "}
                                    <BiChevronDown />
                                  </>
                                ) : (
                                  <>
                                    <img src={images.user} alt="" />
                                  </>
                                )}
                              </button>
                              <div ref={wrapperLoggedOutRef}>
                                <ul
                                  style={{
                                    display: showSignIn ? "block" : "none",
                                  }}
                                  className={`custom-search-list`}
                                >
                                  <li className="text-center bottom-li">
                                    <button
                                      className="yellow-bg btn text-white"
                                      onClick={() => setSignInModal(true)}
                                    >
                                      Log In
                                    </button>
                                    <p className="text text-dark">
                                      New to Plywood Bazar?
                                      <Link
                                        to="/Register"
                                        className="brown fw-semibold justify-content-center"
                                      >
                                        Register here
                                      </Link>
                                    </p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------- onely mobile show menu 2nd page menu------------------------------- */}
        {/* ------------------------------------------------- onely mobile show menu 2nd page menu------------------------------- */}
        {mobileshowmenu && (
          <div className="mobileheader d-lg-none">
            <div className="container">
              <div className="row">
                <div className="col-6">
                  <Link to="/">
                    <img
                      src={images.logo}
                      alt=""
                      className="img-fluid mobile-logo d-lg-none"
                    />
                  </Link>
                </div>
                <div className="col-6">
                  <Navbar
                    onToggle={() => toggleOffCanvas()}
                    expanded={navbartollge}
                    expand="lg"
                    className="bottom-bar topnavigation p-0"
                  >
                    <Container fluid>
                      <Navbar.Toggle aria-controls="bottomNavbar-expand-lg" />

                      <Navbar.Offcanvas
                        className="mainnavigation"
                        // id="bottomNavbar-expand-lg"
                        // aria-labelledby="bottomNavbarLabel-expand-lg"
                        // placement="end"

                        id={`offcanvasNavbar-expand-lg`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
                        placement="end"
                        // className="navbar_top_offcanvas"
                      >
                        <Offcanvas.Header closeButton>
                          <Offcanvas.Title id="bottomNavbarLabel-expand-lg">
                            <img
                              src={images.logo}
                              alt=""
                              className="img-fluid mobile-logo d-lg-none"
                            />
                          </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                          <Nav className="flex-grow-1">
                            <>
                              {categoryArr &&
                                categoryArr.map((category, index) => (
                                  <div
                                    className="nav-link mobile_accroid"
                                    key={index}
                                  >
                                    <Accordion className="mobile_accroid">
                                      <Accordion.Item eventKey="0">
                                        <Accordion.Header className="headeraccrodion">
                                          <Link
                                            to={`/Shop?categories=${category._id}`}
                                          >
                                            {category?.name}
                                          </Link>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                          {category.subCategoryArr &&
                                            category.subCategoryArr.length >
                                              0 && (
                                              <div
                                                className="custom-dropdown"
                                                key={index}
                                              >
                                                <div className="container h-100">
                                                  <div className="custom-dropdown-inner">
                                                    <ul className="category-list">
                                                      {category.subCategoryArr &&
                                                        category.subCategoryArr.map(
                                                          (
                                                            subcategory,
                                                            index2
                                                          ) => (
                                                            <li key={index2}>
                                                              <a
                                                                href={`/Shop?categories=${category._id}&sub=${subcategory.slug}`}
                                                                className="link"
                                                              >
                                                                {
                                                                  subcategory.name
                                                                }
                                                              </a>
                                                            </li>
                                                          )
                                                        )}
                                                    </ul>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                        </Accordion.Body>
                                      </Accordion.Item>
                                    </Accordion>
                                  </div>
                                ))}
                              <Nav className="mobile_botm_border">
                                <NavLink
                                  onClick={() => (setNavbartollge = false)}
                                  className="nav-link"
                                  to="/"
                                >
                                  Home
                                </NavLink>
                                <NavLink
                                  onClick={() => (setNavbartollge = false)}
                                  className="nav-link"
                                  to="/Shop"
                                >
                                  View Products
                                </NavLink>

                                <NavLink
                                  onClick={() => (setNavbartollge = false)}
                                  className="nav-link"
                                  to="/View/My-Tickets"
                                >
                                  Help
                                </NavLink>

                                <NavLink
                                  onClick={() => (setNavbartollge = false)}
                                  className="nav-link"
                                  to="/View/blogs"
                                >
                                  Blogs
                                </NavLink>
                              </Nav>
                            </>
                          </Nav>
                        </Offcanvas.Body>
                      </Navbar.Offcanvas>
                    </Container>
                  </Navbar>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ------------------------------------------------- onely mobile show menu 2nd page menu end ------------------------------- */}
        {/* ------------------------------------------------- onely mobile show menu 2nd page menu end ------------------------------- */}

        {showcatgoryNav && (
          <Navbar
            onToggle={() => toggleOffCanvas()}
            expanded={navbartollge}
            expand="lg"
            ref={wrapper2Ref}
            // className="navbar_top bg-white navbartop px-4pc"
            className="bottom-bar sticky-top topnavigation"
          >
            <Container fluid>
              <Navbar.Toggle aria-controls="bottomNavbar-expand-lg" />
              <Link to="/">
                <img
                  src={images.logo}
                  alt=""
                  className="img-fluid mobile-logo d-lg-none"
                />
              </Link>

              <Navbar.Offcanvas
                className="mainnavigation"
                // id="bottomNavbar-expand-lg"
                // aria-labelledby="bottomNavbarLabel-expand-lg"
                // placement="end"

                id={`offcanvasNavbar-expand-lg`}
                aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
                placement="end"
                // className="navbar_top_offcanvas"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id="bottomNavbarLabel-expand-lg">
                    <img
                      src={images.logo}
                      alt=""
                      className="img-fluid mobile-logo d-lg-none"
                    />
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="topheader_scroll">
                  <Nav className="flex-grow-1 webkitnone">
                    {windowWidth < 992 ? (
                      <>
                        {categoryArr &&
                          categoryArr.map((category, index) => (
                            <div
                              className="nav-link mobile_accroid"
                              key={index}
                            >
                              <Accordion className="mobile_accroid">
                                <Accordion.Item eventKey="0">
                                  <Accordion.Header className="headeraccrodion">
                                    <Link
                                      to={`/Shop?categories=${category._id}`}
                                    >
                                      {category?.name}
                                    </Link>
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    {category.subCategoryArr &&
                                      category.subCategoryArr.length > 0 && (
                                        <div
                                          className="custom-dropdown"
                                          key={index}
                                        >
                                          <div className="container h-100">
                                            <div className="custom-dropdown-inner">
                                              <ul className="category-list">
                                                {category.subCategoryArr &&
                                                  category.subCategoryArr.map(
                                                    (subcategory, index2) => (
                                                      <li key={index2}>
                                                        <a
                                                          href={`/Shop?categories=${category._id}&sub=${subcategory.slug}`}
                                                          className="link"
                                                        >
                                                          {subcategory.name}
                                                        </a>
                                                      </li>
                                                    )
                                                  )}
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            </div>
                          ))}
                        <Nav className="mobile_botm_border">
                          <NavLink
                            onClick={() => (setNavbartollge = false)}
                            className="nav-link"
                            to="/"
                          >
                            Home
                          </NavLink>
                          <NavLink
                            onClick={() => (setNavbartollge = false)}
                            className="nav-link"
                            to="/Shop"
                          >
                            View Products
                          </NavLink>

                          <NavLink
                            onClick={() => (setNavbartollge = false)}
                            className="nav-link"
                            to="/View/My-Tickets"
                          >
                            Help
                          </NavLink>

                          <NavLink
                            onClick={() => (setNavbartollge = false)}
                            className="nav-link"
                            to="/View/blogs"
                          >
                            Blogs
                          </NavLink>
                        </Nav>
                      </>
                    ) : (
                      <>
                        {categoryArr &&
                          categoryArr.map((category, index) => (
                            <>
                              <div
                                // className="nav-link"
                                // key={index}
                                // onClick={() => handleCheckCategory(category)}
                                className={`nav-link ${
                                  activeCategory == category?._id
                                    ? "active"
                                    : ""
                                }`}
                                key={index}
                                onClick={() => handleCheckCategory(category)}
                              >
                                <Link to="/">{category?.name} </Link>

                                {/* {category.checked && category.subCategoryArr &&
                                category.subCategoryArr.length > 0 && (
                                  <div
                                    className="custom-dropdowns"
                                    style={{ marginTop: -5, zIndex: -1 }}
                                    key={index}
                                  >
                                    <div className="container">
                                      <div className="custom-dropdown-inner">
                                        <ul className="category-list">
                                          {category.subCategoryArr &&
                                            category.subCategoryArr.map(
                                              (subcategory, index2) => (
                                                <li key={index2}>
                                                  <a
                                                    href={`/Shop?categories=${category._id}&sub=${subcategory.slug}`}
                                                    className="link"
                                                  >
                                                    {subcategory.name}
                                                  </a>
                                                </li>
                                              )
                                            )}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )} */}
                              </div>
                              {category.checked &&
                              category.subCategoryArr &&
                              category.subCategoryArr.length > 0 ? (
                                <div className="megamenheader">
                                  <div className="container">
                                    <div className="row">
                                      {category.subCategoryArr &&
                                        category.subCategoryArr.length > 0 && (
                                          <div className="col-12">
                                            <ul className="category-list">
                                              {category.subCategoryArr &&
                                                category.subCategoryArr.map(
                                                  (subcategory, index2) => (
                                                    <li key={index2}>
                                                      <a
                                                        href={`/Shop?categories=${category._id}&sub=${subcategory.slug}`}
                                                        className="link"
                                                      >
                                                        {subcategory.name}
                                                      </a>
                                                    </li>
                                                  )
                                                )}
                                            </ul>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </>
                          ))}
                      </>
                    )}
                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
        )}
      </header>

      <Modal show={signInModal} centered onHide={() => setSignInModal(false)}>
        <Modal.Body className="sign-in-modal custom-modal">
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            onClick={() => setSignInModal(false)}
          ></button>
          <div>
            <Link to="/" className="navbar-brand">
              <img src={images.logo} alt="" className="main-logo img-fluid" />
            </Link>
          </div>
          <h2 className="heading">Log In via</h2>
          <form className="form row">
            {/* <label>Login via </label> */}
            {/* {otpsent == false && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                  marginTop: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="radio"
                    name="type2"
                    id="222"
                    // value={true}
                    checked={loginByEmail}
                    onChange={(e) => setLoginByEmail(true)}
                  />
                  <label for="222" className="mx-2">
                    Email
                  </label>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="radio"
                    name="type2"
                    id="223"
                    checked={!loginByEmail}
                    onChange={(e) => setLoginByEmail(false)}
                  />
                  <label for="223" className="mx-2">
                    Phone
                  </label>
                </div>
              </div>
            )} */}

            {loginByEmail ? (
              <div className="col-12">
                {otpsent ? (
                  <div className="input flex-1">
                    <label className="text-start">
                      Enter OTP sent to {mobile}
                    </label>
                    <input
                      type="text"
                      className="w-100 form-control bg-grey"
                      placeholder="Enter Your OTP"
                      value={otp}
                      onChange={(e) => setotp(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="input flex-1">
                    <label className="text-start">Email</label>
                    <input
                      type="text"
                      className="w-100 form-control bg-grey"
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="col-12">
                {otpsent ? (
                  <div className="input flex-1">
                    <label className="text-start">
                      Enter OTP sent to {mobile}
                    </label>
                    <input
                      type="text"
                      className="w-100 form-control bg-grey"
                      placeholder="Enter Your OTP"
                      value={otp}
                      onChange={(e) => setotp(e.target.value)}
                    />

                    <div className="text-end">
                      <div
                        className="resendtp"
                        onClick={() => {
                          resendOtp();
                        }}
                      >
                        Resend OTP
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="input flex-1">
                    <label className="text-start">Phone number</label>
                    <input
                      type="number"
                      maxLength={10}
                      className="w-100 form-control bg-grey"
                      placeholder="Enter Your Mobile Number"
                      value={mobile}
                      onChange={(e) => setmobile(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="col-12">
              {otpsent ? (
                <button
                  type="button"
                  onClick={() => {
                    handlesLogin();
                  }}
                  className="btn btn-custom text-white yellow-bg py-2 w-100"
                >
                  Verfiy
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handlesendOtp();
                  }}
                  className="btn btn-custom text-white yellow-bg py-2 w-100"
                >
                  Submit
                </button>
              )}

              <Link
                to="/Register"
                onClick={() => {
                  handleRegister();
                }}
                className="btn btn-custom mt-2 text-white yellow-bg py-2 w-100"
              >
                Register Now
              </Link>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Header;
