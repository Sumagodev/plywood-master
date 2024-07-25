import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { BiChevronDown } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteProductbyId,
  getAllProducts,
} from "../../services/Product.service";
import { errorToast } from "../Utility/Toast";
import { toastError, toastSuccess } from "../../utils/toastutill";
import ReactPaginate from "react-paginate";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

export default function Products() {
  let userObj = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  const [totalElements, setTotalElements] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [productArr, setProductArr] = useState([]);

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
      name: "Price",
      selector: (row, index) => row.price,
      sortable: false,
    },
    {
      name: "Selling Price",
      selector: (row, index) => row.sellingprice,
      sortable: false,
    },
    {
      name: "Approval Status",
      selector: (row, index) => row.approved,
      sortable: false,
    },
    {
      name: "Action",
      cell: (row, index) => (
        <>
          <button
            type="button"
            onClick={() => navigate(`/AddProducts?productId=${row.slug}`)}
            className="btn btn-custom btn-yellow"
          >
            <FaPencilAlt />
          </button>
          <button
            type="button"
            onClick={() => handleDelteProduct(`${row._id}`)}
            className="btn btn-custom btn-yellow ms-2"
          >
            <FaTrash />
          </button>
        </>
      ),
      sortable: false,
    },
  ];

  const handleGetProducts = async (skipValue, limitValue, searchQuery) => {
    try {
      let query = `page=${skipValue}&perPage=${limitValue}&userId=${userObj?._id}`;

      if (searchQuery) {
        query = `${query}&q=${searchQuery}`;
      }

      let { data: res } = await getAllProducts(query);
      if (res.data) {
        setTotalElements(res.totalElements);
        setProductArr(res.data);
      }
    } catch (err) {
      errorToast(err);
    }
  };

  const handleDelteProduct = async (id) => {
    try {
      if (!window.confirm("Are You Sure ?")) {
        return;
      }

      let { data: res } = await deleteProductbyId(id);
      if (res.success) {
        toastSuccess(res.message);
        handleGetProducts(1, limit);
      }
    } catch (err) {
      errorToast(err);
    }
  };
  const handlePerRowsChange = (newPerPage, page) => {
    handleGetProducts(page, newPerPage);
    setLimit(newPerPage);
  };
  const handlePageChange = (page) => {
    // alert("Asd")
    if (totalElements / page > 1) {
      setPage(page);
      handleGetProducts(page, limit);
    }
  };

  const debouncedSave = useCallback(
    // skipValue, limitValue, filterCondition, searchQueryValue, school, company
    debounce((nextValue) => handleGetProducts(page, limit, nextValue)(), 1000),

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
    handleGetProducts(1, limit);
  }, []);

  const [totalPages, setTotalPages] = useState(5);
  return (
    <>
      <div className="container-fluid">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-md-10 mb-5">
            <div className="row d-flex mt-5 align-items-center justify-content-between">
              <div className="col-6 col-sm-4">
                <h4 className="yellow">Your products</h4>
              </div>
              <div className="col-6 col-sm-4 d-flex justify-content-end">
                <Link
                  to="/AddProducts"
                  className="yellow-bg btn text-white subsctiption-card-button"
                >
                  Add Product
                </Link>
              </div>
            </div>
            <div className="row d-flex justify-content-end mt-4">
              <div className="col-12 col-sm-3">
                <input
                  type="text"
                  placeholder="Search products here ..."
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
                data={productArr}
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
          </div>
        </div>
      </div>
    </>
  );
}
