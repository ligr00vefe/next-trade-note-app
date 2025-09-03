'use client';
import React, { useState } from 'react';
import styles from './Pagination.module.scss';

interface IPagenationProps {
    currentPage: number;
    productsPerPage: number;
    setCurrentPage: (page: number) => void;
    totalProducts: number;
}
const Pagination = ({
    currentPage,
    productsPerPage,
    setCurrentPage,
    totalProducts,
}: IPagenationProps) => {
    const pageNumbers = [];
    // const totalPages = totalProducts / productsPerPage;
    // limit the page Numvers shown
    const [pageNumberLimit] = useState(3);
    const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(3);
    const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

    // function to paginate / select a particular page
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // go to previous page
    const paginatePrevPage = () => {
        setCurrentPage(currentPage - 1);

        // show previous set of pageNumbers
        if ((currentPage - 1) % pageNumberLimit === 0) {
            setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
    };

    // go to next page
    const paginateNextPage = () => {
        setCurrentPage(currentPage + 1);

        // show next set of pageNumbers
        if (currentPage + 1 > maxPageNumberLimit) {
            setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
            setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }
    };

    for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <ul className={styles.pagination}>
                <li
                    onClick={paginatePrevPage}
                    className={
                        currentPage === pageNumbers[0] ? `${styles.hidden}` : ''
                    }
                >
                    {'<'}
                </li>

                {pageNumbers.map((number) => {
                    if (
                        number < maxPageNumberLimit + 1 &&
                        number > minPageNumberLimit
                    ) {
                        return (
                            <li
                                key={number}
                                onClick={() => paginate(number)}
                                className={
                                    currentPage === number
                                        ? `${styles.active}`
                                        : ''
                                }
                            >
                                {number}
                            </li>
                        );
                    }
                })}

                <li
                    onClick={paginateNextPage}
                    className={
                        currentPage === pageNumbers[pageNumbers.length - 1]
                            ? `${styles.hidden}`
                            : ''
                    }
                >
                    {'>'}
                </li>
            </ul>
        </>
    );
};

export default Pagination;
