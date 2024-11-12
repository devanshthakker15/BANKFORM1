// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import EmployeeForm from '../components/EmployeeForm';
// import { Provider } from 'react-redux';
// import { store } from '../redux/store';
// import { MemoryRouter, Route } from 'react-router-dom';
// import axios from 'axios';

// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// describe('EmployeeForm Component', () => {
//   it('renders EmployeeForm with initial values', () => {
//     render(
//       <Provider store={store}>
//         <MemoryRouter initialEntries={['/employee/edit/1']}>
//           <Route path="/employee/edit/:id">
//             <EmployeeForm />
//           </Route>
//         </MemoryRouter>
//       </Provider>
//     );

//     expect(screen.getByLabelText('Name')).toBeInTheDocument();
//     expect(screen.getByLabelText('Username')).toBeInTheDocument();
//     expect(screen.getByLabelText('Email')).toBeInTheDocument();
//     expect(screen.getByLabelText('Company Name')).toBeInTheDocument();
//   });

//   it('submits the form with the entered data', async () => {
//     // Mocking the axios POST request for returning a successful response
//     mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

//     render(
//       <Provider store={store}>
//         <MemoryRouter>
//           <EmployeeForm />
//         </MemoryRouter>
//       </Provider>
//     );

//     // Simulate user input
//     fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
//     fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'johndoe' } });
//     fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
//     fireEvent.change(screen.getByLabelText('Company Name'), { target: { value: 'Example Corp' } });

    
//     fireEvent.click(screen.getByRole('button', { name: /submit/i }));

   
//     await waitFor(() => expect(mockedAxios.post).toHaveBeenCalled());
//   });
// });