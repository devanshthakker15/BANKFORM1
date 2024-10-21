import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumb';
import { generateBreadcrumbItems } from '../utils/breadcrumbsUtils';

jest.mock('../utils/breadcrumbsUtils', () => ({
  generateBreadcrumbItems: jest.fn(),
}));

describe('Breadcrumbs Component', () => {
  it('renders breadcrumb links correctly', () => {
  
    const mockBreadcrumbItems = [
      { label: 'Home', path: '/' },
      { label: 'About', path: '/about' },
    ];


    (generateBreadcrumbItems as jest.Mock).mockReturnValue(mockBreadcrumbItems);

 
    const { getByText } = render(
      <BrowserRouter>
        <Breadcrumbs />
      </BrowserRouter>
    );

    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('About')).toBeInTheDocument();
  });

  it('renders the last breadcrumb item as active', () => {
    const mockBreadcrumbItems = [
      { label: 'Home', path: '/' },
      { label: 'About', path: '/about' },
    ];

    (generateBreadcrumbItems as jest.Mock).mockReturnValue(mockBreadcrumbItems);

    const { getByText } = render(
      <BrowserRouter>
        <Breadcrumbs />
      </BrowserRouter>
    );

  
    const aboutLink = getByText('About');
    expect(aboutLink).not.toHaveAttribute('href');
    expect(aboutLink).toHaveClass('active');
  });

  it('renders breadcrumb correctly with dynamic routes', () => {
    const mockBreadcrumbItems = [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' },
      { label: 'Laptops', path: '/products/laptops' },
    ];

    (generateBreadcrumbItems as jest.Mock).mockReturnValue(mockBreadcrumbItems);

    const { getByText } = render(
      <MemoryRouter initialEntries={['/products/laptops']}>
        <Breadcrumbs />
      </MemoryRouter>
    );


    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('Products')).toBeInTheDocument();
    expect(getByText('Laptops')).toBeInTheDocument();
    expect(getByText('Laptops')).toHaveClass('active');
  });
});
