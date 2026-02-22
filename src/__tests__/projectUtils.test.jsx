import { filterProjects, pickRandomProject } from '../lib/projectUtils';

describe('projectUtils', () => {
  test('pickRandomProject returns null for empty arrays', () => {
    expect(pickRandomProject([])).toBeNull();
  });

  test('pickRandomProject returns deterministic project when Math.random is mocked', () => {
    const projects = [{ slug: 'a' }, { slug: 'b' }, { slug: 'c' }];
    jest.spyOn(Math, 'random').mockReturnValue(0.7);
    expect(pickRandomProject(projects)).toEqual({ slug: 'c' });
    Math.random.mockRestore();
  });

  test('filterProjects matches project name and student name', () => {
    const projects = [
      { name: 'Robotics Dashboard', studentName: 'Amaya' },
      { name: 'Poetry Site', studentName: 'Jordan' }
    ];

    expect(filterProjects(projects, 'robot')).toHaveLength(1);
    expect(filterProjects(projects, 'jordan')).toHaveLength(1);
    expect(filterProjects(projects, 'missing')).toHaveLength(0);
  });
});
