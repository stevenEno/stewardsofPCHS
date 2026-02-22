import { mapProjectPayload, parseProjectMetadata } from '../lib/githubApi';

describe('githubApi helpers', () => {
  test('parseProjectMetadata decodes base64 JSON', () => {
    const payload = btoa(JSON.stringify({ name: 'Test Project', studentName: 'Student A' }));
    const parsed = parseProjectMetadata(payload);

    expect(parsed.name).toBe('Test Project');
    expect(parsed.studentName).toBe('Student A');
  });

  test('mapProjectPayload maps metadata and assets into project shape', () => {
    const project = mapProjectPayload(
      'test-slug',
      {
        name: 'Physics Simulation',
        description: 'A spring-mass simulation.',
        studentName: 'Chris',
        githubLink: 'https://github.com/example/repo/pull/1'
      },
      [
        { name: 'thumbnail.jpg', download_url: 'https://cdn/thumb.jpg' },
        { name: 'demo.mp4', download_url: 'https://cdn/demo.mp4' }
      ]
    );

    expect(project.slug).toBe('test-slug');
    expect(project.thumbnailUrl).toContain('thumb.jpg');
    expect(project.demoVideoUrl).toContain('demo.mp4');
  });
});
