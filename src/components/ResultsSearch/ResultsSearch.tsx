import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../../types/Product';
import { Breadcrumbs } from '../Breadcrumbs';
import { ProductItem } from '../ProductItem';
import { Droplist } from '../Droplist/Droplist';
import './results-search.scss';
import { sortProducts } from '../../helpers/sortProducts';
import { Pagination } from '../Pagination';

const optionsSort = ['newest', 'alphabetically', 'price'];
const optionsItemsPage = ['4', '8', '16', 'all'];

type Props = {
  products: Product[];
};

export const ResultsSearch: FC<Props> = ({ products }) => {
  const countProducts = products.length;
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const sortedBy = searchParams.get('sortBy') || '';
  const perPage = Number(searchParams.get('perPage')) || countProducts;
  const lastPage = Math.ceil(countProducts / perPage);
  const isPaginationShow = perPage !== countProducts && lastPage > 1;

  const start = currentPage * perPage - perPage;
  const end = currentPage * perPage <= countProducts
    ? currentPage * perPage
    : countProducts;

  const sortedProducts = sortProducts(products, sortedBy);
  const visibleProducts = sortedProducts.slice(start, end);

  return (
    <div className="results-search">
      <div className="results-search__container">
        <div className="product-list__top-row">
          <Breadcrumbs />
        </div>
        <h1 className="product-list__title title">Mobile Phones</h1>
        <p className="product-list__count">{`${countProducts} results`}</p>
        <div className="product-list__droplist">
          <Droplist
            options={optionsSort}
            startValue="Choose an option"
            label="Sort by"
            searchParamsKey="sortBy"
          />
          <Droplist
            options={optionsItemsPage}
            startValue="All"
            label="Items on page"
            searchParamsKey="perPage"
          />
        </div>
        {countProducts !== 0 ? (
          <div className="results-search__content grid">
            {visibleProducts.map((product: Product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="results-search__not-found">
            Nothing was found for your request
          </p>
        )}
        <div className="results-search__pagination">
          {isPaginationShow && (
            <Pagination
              total={countProducts}
              perPage={perPage}
              currentPage={currentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
