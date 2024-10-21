import { render, screen, fireEvent } from '@testing-library/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import TextInput from '../components/TextInput';

// Validation schema for testing required fields
const validationSchema = Yup.object({
  input: Yup.string().required('This field is required'),
});

describe('TextInput', () => {
  it('renders the text input field correctly', () => {
    render(
      <Formik initialValues={{ input: '' }} onSubmit={() => {}}>
        <Form>
          <TextInput label="Test Input" name="input" />
        </Form>
      </Formik>
    );

    const input = screen.getByLabelText(/test input/i);
    expect(input).toBeInTheDocument();
  });

  it('allows entering text', () => {
    render(
      <Formik initialValues={{ input: '' }} onSubmit={() => {}}>
        <Form>
          <TextInput label="Test Input" name="input" />
        </Form>
      </Formik>
    );

    const input = screen.getByLabelText(/test input/i);
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(input).toHaveValue('test value');
  });

  it('shows error message if validation fails', async () => {
    render(
      <Formik
        initialValues={{ input: '' }}
        onSubmit={() => {}}
        validationSchema={validationSchema}
      >
        <Form>
          <TextInput label="Test Input" name="input" required />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(/this field is required/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
