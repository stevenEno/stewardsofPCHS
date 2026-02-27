import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PathwaysPage from '../PathwaysPage';

describe('PathwaysPage', () => {
  test('renders pathways hero and supports path focus', async () => {
    const user = userEvent.setup();
    render(<PathwaysPage />);

    expect(screen.getAllByText('Pathways of Pacifica').length).toBeGreaterThan(0);
    expect(screen.getByText('From All Neighborhoods, Toward Lives of Purpose')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Focus pathway for Student A'));

    expect(screen.getByText('Focused Pathway')).toBeInTheDocument();
    expect(screen.getAllByText('Student A').length).toBeGreaterThan(0);
  });
});
