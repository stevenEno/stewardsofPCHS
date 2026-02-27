import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

jest.mock('masonry-layout', () => {
  return jest.fn().mockImplementation(() => ({
    layout: jest.fn(),
    destroy: jest.fn()
  }));
});

jest.mock('../lib/githubApi', () => ({
  fetchProjectsFromGitHub: jest.fn()
}));

const { fetchProjectsFromGitHub } = require('../lib/githubApi');

const sampleProjects = [
  {
    slug: 'proj-1',
    name: 'Robotics Dashboard',
    description: 'Control panel for student robot.',
    studentName: 'Ari',
    githubLink: 'https://github.com/example/pull/1',
    thumbnailUrl: 'https://example.com/thumb1.jpg',
    demoVideoUrl: 'https://example.com/demo1.mp4'
  },
  {
    slug: 'proj-2',
    name: 'Portfolio Builder',
    description: 'Generate a portfolio quickly.',
    studentName: 'Sky',
    githubLink: 'https://github.com/example/pull/2',
    thumbnailUrl: 'https://example.com/thumb2.jpg',
    demoVideoUrl: 'https://example.com/demo2.mp4'
  }
];

describe('App integration', () => {
  test('renders header and projects after fetch', async () => {
    fetchProjectsFromGitHub.mockResolvedValue(sampleProjects);

    render(<App />);

    expect(screen.getByText('Loading projects')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Seawolf Project Showcase')).toBeInTheDocument();
      expect(screen.getAllByText('Robotics Dashboard').length).toBeGreaterThan(0);
    });
  });

  test('filters project list based on search input', async () => {
    fetchProjectsFromGitHub.mockResolvedValue(sampleProjects);
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('Portfolio Builder').length).toBeGreaterThan(0);
    });

    await user.type(screen.getByLabelText(/search projects/i), 'Ari');

    expect(screen.getAllByText('Robotics Dashboard').length).toBeGreaterThan(0);
    expect(screen.queryByText('Portfolio Builder')).not.toBeInTheDocument();
  });
});
