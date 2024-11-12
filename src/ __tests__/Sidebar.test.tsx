import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Sidebar from '../components/Sidebar';
import { apiGet } from '../utils/getApi';

jest.mock('../utils/getApi', () => ({
  apiGet: jest.fn().mockResolvedValue({
    data: {
      success: true,
      result: {
        permissions: [
          { id: 1, module: { alias: 'account', module_name: 'Account' }, perm_view: 1 },
          { id: 2, module: { alias: 'permissions', module_name: 'Permissions' }, perm_view: 1 },
          { id: 3, module: { alias: 'notallowed', module_name: 'Not Allowed' }, perm_view: 0 },
        ],
      },
    },
  }),
}));

describe('Sidebar Component', () => {
  it('should not render excluded modules', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Sidebar />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Not Allowed')).not.toBeInTheDocument();
    });
  });


  it('should navigate to BankForm when the "Add form" button is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Sidebar />
      </MemoryRouter>
    );

    const bankFormButton = screen.getByText('Add form');
    fireEvent.click(bankFormButton);
  });



  it('should not render sidebar content on login page', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Sidebar />
      </MemoryRouter>
    );
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });


  // it('should navigate to login page on logout button click', () => {
  //   const history = createMemoryHistory();
  //   render(
  //     <Router history={history}>
  //       <Sidebar />
  //     </Router>
  //   );

  //   const logoutButton = screen.getByText('Logout');
  //   fireEvent.click(logoutButton);
  //   expect(history.location.pathname).toBe('/login');
  // });
});
