import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SkillTreePage from '../SkillTreePage';

jest.mock('../lib/skillTreeApi', () => ({
  fetchSubjects: jest.fn(),
  fetchSubjectTree: jest.fn(),
  fetchRecommendations: jest.fn(),
  updateMastery: jest.fn(),
  fetchCrossLinks: jest.fn(),
  getApiBaseUrl: jest.fn(() => 'http://127.0.0.1:8080')
}));

const {
  fetchSubjects,
  fetchSubjectTree,
  fetchRecommendations,
  updateMastery,
  fetchCrossLinks
} = require('../lib/skillTreeApi');

describe('SkillTreePage', () => {
  beforeEach(() => {
    fetchSubjects.mockResolvedValue([
      { name: 'Mathematics', key: 'mathematics', nodeCount: 2, edgeCount: 1, legend: {} }
    ]);

    fetchSubjectTree.mockResolvedValue({
      name: 'Mathematics',
      nodes: [
        { id: 'math-001', name: 'Node 1', description: 'Desc', level: '9th Grade', resources: [], crossLinks: [] },
        { id: 'math-002', name: 'Node 2', description: 'Desc', level: '9th Grade', resources: [], crossLinks: [] }
      ],
      edges: [{ from: 'math-001', to: 'math-002' }],
      legend: {}
    });

    fetchRecommendations.mockResolvedValue({
      counts: { totalNodes: 2, mastered: 0, recommended: 1, locked: 1 },
      nodes: [
        {
          id: 'math-001',
          name: 'Node 1',
          description: 'Desc 1',
          level: '9th Grade',
          status: 'recommended',
          resources: [],
          crossLinks: []
        },
        {
          id: 'math-002',
          name: 'Node 2',
          description: 'Desc 2',
          level: '9th Grade',
          status: 'locked',
          resources: [],
          crossLinks: []
        }
      ]
    });

    fetchCrossLinks.mockResolvedValue({ links: [] });
    updateMastery.mockResolvedValue({ mastered: true });
  });

  test('loads and displays skill tree nodes', async () => {
    render(<SkillTreePage />);

    await waitFor(() => {
      expect(screen.getByText('High School Skill Tree Explorer')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Node 1' })).toBeInTheDocument();
    });

    expect(screen.getByText('Total Nodes')).toBeInTheDocument();
    expect(fetchSubjects).toHaveBeenCalled();
  });

  test('updates mastery for selected node', async () => {
    const user = userEvent.setup();
    render(<SkillTreePage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Node 1' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Mark Mastered' }));

    expect(updateMastery).toHaveBeenCalledWith('demo-student', 'mathematics', 'math-001', true);
  });
});
