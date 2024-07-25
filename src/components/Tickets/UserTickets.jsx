import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { BiChevronDown } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../services/Product.service";
import { getTicketsbyUserId } from "../../services/UserTicket.service";
import { errorToast } from "../Utility/Toast";
import Accordion from "react-bootstrap/Accordion";

export default function UserTickets() {
  let userObj = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  const [totalElements, setTotalElements] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [ticketsArr, setProductArr] = useState([]);
  const [userId, setUserId] = useState("");
  const isAuthorized = useSelector((state) => state.auth.isAuthorized);

  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    {
      name: "S.no",
      selector: (row, index) => index + 1,
      sortable: false,
      width: "5%",
    },
    {
      name: "Name",
      selector: (row, index) => row.name,
      sortable: false,
    },
    {
      name: "Action",
      cell: (row, index) => (
        <button
          type="button"
          onClick={() => navigate(`/View/View-Ticket/${row._id}`)}
          className="btn btn-custom btn-yellow"
        >
          View Messages
        </button>
      ),
      sortable: false,
    },
  ];

  const handleGetUserTickets = async (skipValue, limitValue, searchQuery) => {
    try {
      let query = `page=${skipValue}&perPage=${limitValue}&userId=${userObj?._id}`;

      if (searchQuery) {
        query = `${query}&q=${searchQuery}`;
      }

      let { data: res } = await getTicketsbyUserId(query);
      if (res.data) {
        setTotalElements(res.totalElements);
        setProductArr(res.data);
      }
    } catch (err) {
      errorToast(err);
    }
  };

  const handlePerRowsChange = (newPerPage, page) => {
    handleGetUserTickets(page, newPerPage);
    setLimit(newPerPage);
  };
  const handlePageChange = (page) => {
    // alert("Asd")
    if (totalElements / page > 1) {
      setPage(page);
      handleGetUserTickets(page, limit);
    }
  };

  const debouncedSave = useCallback(
    // skipValue, limitValue, filterCondition, searchQueryValue, school, company
    debounce(
      (nextValue) => handleGetUserTickets(page, limit, nextValue)(),
      1000
    ),

    [] // will be created only once initially
  );

  // highlight-ends

  const handleChange = (event) => {
    const nextValue = event;

    setSearchQuery(nextValue);

    // Even though handleChange is created on each render and executed

    // it references the same debouncedSave that was created initially

    debouncedSave(nextValue);
  };

  useEffect(() => {
    if (isAuthorized) {
      handleGetUserTickets(1, limit);
    }
  }, [isAuthorized]);

  return (
    <>
      <div className="row d-flex justify-content-center">
        <div className="col-10 mb-5">
          {isAuthorized && (
            <>
              <div className="row d-flex mt-5 align-items-center justify-content-between">
                <h4 className="col-4 yellow">Your Tickets</h4>
                <div className="col-2 d-flex justify-content-end">
                  <Link
                    to="/View/Add-Ticket"
                    className="yellow-bg btn text-white subsctiption-card-button"
                  >
                    Create a new ticket
                  </Link>
                </div>
              </div>
              <div className="row d-flex justify-content-end mt-4">
                <div className="col-3">
                  <input
                    type="text"
                    placeholder="Search tickets here ..."
                    onChange={(e) => handleChange(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="react-dataTable">
                <DataTable
                  noHeader
                  subHeader
                  sortServer
                  pagination
                  responsive
                  columns={columns}
                  sortIcon={<BiChevronDown />}
                  className="react-dataTable"
                  data={ticketsArr}
                  paginationServer
                  paginationTotalRows={totalElements}
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                  // subHeaderComponent={
                  //     // <CustomHeader
                  //     //     store={store}
                  //     //     searchTerm={searchTerm}
                  //     //     rowsPerPage={rowsPerPage}
                  //     //     handleFilter={handleFilter}
                  //     //     handlePerPage={handlePerPage}
                  //     //     toggleSidebar={toggleSidebar}
                  //     // />
                  // }
                />

                {/* <ReactPaginate
                            previousLabel={'<'}
                            nextLabel={'>'}
                            pageCount={totalPages || 1}
                            // activeClassName='active'
                            forcePage={page !== 0 ? page - 1 : 0}
                            // onPageChange={page => handlePagination(page)}
                            // pageClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            // nextClassName={'page-item'}
                            // previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            pageLinkClassName={'page-link'}
                            containerClassName={'pagination react-paginate justify-content-end my-2 pe-1'}
                        /> */}
              </div>
            </>
          )}

          <div className="row d-flex mt-5 align-items-center justify-content-between"></div>
          <div className="row justify-content-center">
            <div className="col-12 col-md-10">
              <h4 className="yellow">FAQ</h4>
            </div>
            <div className="col-12 col-md-10">
              <Accordion className="mt-3">
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    {" "}
                    <div className="accordianHeading">
                      What is plywoodbazar.com{" "}
                    </div>{" "}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>
                      Plywood bazar. com is India's largest online B2B market
                      place brought a platform to interact with Manufacturers,
                      Distributors, Dealers, Wholesalers and Retailers of
                      Furniture, Plywood, Hardware & Interior- Exterior
                      Industries.{" "}
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    {" "}
                    <div className="accordianHeading">
                      How to Register{" "}
                    </div>{" "}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>
                      <strong>
                        {" "}
                        Click Profile Icon right side corner at the top of
                        website{" "}
                      </strong>{" "}
                    </p>
                    <p>Then Click on Register here option.</p>
                    <p>
                      Then Select radio button for Who are you? i.e.
                      MANUFACTURER/IMPORTER, DISTRIBUTOR Or DEALER.{" "}
                    </p>
                    <p>
                      Then Fill other information like Name Of Organization ,
                      Email , Name Of Authorised Person , Contact No. What’s App
                      No. Address , Upload Profile Photo , Banner photo etc.{" "}
                    </p>
                    <p>Then click on the Register Button. </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    {" "}
                    <div className="accordianHeading">
                      What is the Subscription{" "}
                    </div>{" "}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>
                      An amount of money that you pay, usually once a year, to
                      receive a membership for connecting to our website as a
                      MANUFACTURER/IMPORTER, DISTRIBUTOR Or DEALER. regularly or
                      to belong to an organization.{" "}
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>
                    {" "}
                    <div className="accordianHeading">
                      What is flash sale{" "}
                    </div>{" "}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>
                      A sale of goods at greatly reduced prices, lasting for
                      only a short period of time. A discount or promotion
                      offered by an ecommerce store for a short period of time. 
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
