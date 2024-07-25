import React from "react";
import { AiOutlineSafety, AiOutlineStar } from "react-icons/ai";
import { RiMessage2Line } from "react-icons/ri";
import aboutimg from "../../src/assets/images/about.jpg"
import teamimg from "../../src/assets/images/about_imga.jpg";
import teamimg1 from "../../src/assets/images/team1111.jpeg";
import teamimg2 from "../../src/assets/images/team211.jpg";
import teamimg3 from "../../src/assets/images/team3111.jpg";
import { BiStore } from "react-icons/bi";
import { MdOutlineVerified } from "react-icons/md";
import { GiPayMoney } from "react-icons/gi";
import { Link } from "react-router-dom";

const Aboutus = () => {
  return (
    <div>
      <main>
        <section className="main-banner mb-80">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-6">
                <div className="content">
                  <h1 className="heading">About Us</h1>
                  <p className="desp">
                    Plywood bazar is India's largest online B2B marketplace,
                    connecting buyers with suppliers.
                  </p>
                  <ul className="list">
                    <li>
                      <div className="icon">
                        <AiOutlineStar />
                      </div>
                      <h6>Trusted Platform</h6>
                    </li>
                    <li>
                      <div className="icon">
                        <AiOutlineSafety />
                      </div>
                      <h6>Safe & Secure</h6>
                    </li>
                    <li>
                      <div className="icon">
                        <RiMessage2Line />
                      </div>
                      <h6>Quick Assistance</h6>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <div className="container">
            <div className="row">
                <div className="col-6">
                    <h2>About us</h2>
                </div>
                <div className="col-6">
                    <p>Plywoodbazar. com is India's largest online B2B market place brought a platform to interact with Manufacturers, Retailers, and Wholesalers of Furniture, Plywood, Hardware & Interior Exterior Industries.</p>
                </div>
            </div>
        </div> */}

        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="leftarea">
                {/* <p>Welcome to our company</p> */}
                <h2 className="heading brown mb-3">About Us</h2>
                <p className="mb-5">
                  Plywoodbazar. com is India's largest online B2B market place
                  brought a platform to interact with Manufacturers,
                  Distributors ,Dealers, Wholesalers and Retailers of Furniture,
                  Plywood, Hardware & Interior- Exterior Industries.
                </p>
                <h3 className="heading brown text-start mb-3">
                  Company Mission
                </h3>
                <p>
                  Plywood Bazar.com is a startup that is working to improve this
                  unorganized furniture , interior and exterior industry by
                  co-ordinate in between them. Providing large potential market
                  exposure for business expansion.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="leftarea">
                <img src={aboutimg} alt="" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>

        {/* choose us section */}
        <section className="mb-80 mt-80">
          <div className="container">
            <div className="text-center mb-5 pb-5">
              <h1 className="heading bottom-line brown">
                Why you should onboard with us’
              </h1>
            </div>
            <div className="row">
              <div className="col-12 col-lg-4 mb-lg-0 mb-5">
                <div className="more-box">
                  <div className="icon">
                    <BiStore />
                  </div>
                  <div className="content">
                    <h4>Sell on Plywood Bazar for free</h4>
                    <p>
                    Reach a Massive Network of Buyers - Effortlessly
Plywood Bazar is India's leading B2B marketplace, connecting you with a vast network of qualified buyers in the furniture, plywood, hardware, and interior & exterior industries.  Selling on Plywood Bazar is completely free!

                    </p>
                    <Link to="/" className="btn btn-custom btn-brown">
                      Start Selling
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4 mt-lg-0 mt-5 mb-lg-0 mb-5">
                <div className="more-box">
                  <div className="icon">
                    <MdOutlineVerified />
                  </div>
                  <div className="content">
                    <h4>Connect with verified sellers.</h4>
                    <p>
                    Find the perfect partners for your furniture, plywood, hardware, and interior/exterior needs.
Plywood Bazar is India's largest B2B marketplace, connecting you with a vast network of verified manufacturers, distributors, dealers, wholesalers, and retailers.  No more sifting through unreliable sources.

                    </p>
                    <Link to="/" className="btn btn-custom btn-brown">
                      Get Verified Sellers
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4 mt-lg-0 mt-5">
                <div className="more-box">
                  <div className="icon">
                    <GiPayMoney />
                  </div>
                  <div className="content">
                    <h4>Pay with plywood Bazar.</h4>
                    <p>
                    Join our vibrant community today and experience the convenience of secure transactions, reliable logistics, and unparalleled customer service. Pay with Plywood Bazar and elevate your business to new heights!
                    </p>
                    <Link to="/" className="btn btn-custom btn-brown">
                      Know More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="mb-80 mt-80">
          <div className="text-center mb-5 pb-5">
            <h1 className="heading bottom-line brown">Our Team</h1>
          </div>
          <div className="container">
            <div className="row team_img">
            <div className="col-12 col-md-4 text-center">
                <img src={teamimg2} alt="" className="img-fluid" />
                  <h5>Sandeep Saini- GM</h5>
              </div>
              <div className="col-12 col-md-4 text-center">
                <img src={teamimg3} alt="" className="img-fluid" />
                <h5>Upashna Tripathi- HR </h5>
              </div>
           
              <div className="col-12 col-md-4 text-center">
                <img src={teamimg1} alt="" className="img-fluid" />
                <h5>Our Team </h5>
              </div>
              
            </div>
          </div>
        </section> */}
      </main>
    </div>
  );
};

export default Aboutus;
