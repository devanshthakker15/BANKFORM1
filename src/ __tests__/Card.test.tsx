import { render, screen } from '@testing-library/react';
import Card from '../components/Card';

describe('Card', () => {
  it('renders correctly with title and children', () => {
    render(
      <Card title="Test Card">
        <p>This is a test content</p>
      </Card>
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is a test content')).toBeInTheDocument();
  });
});
