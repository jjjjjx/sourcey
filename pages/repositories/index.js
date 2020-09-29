import { request } from '@octokit/request';

const Repositories = ({ title, repositories, count }) => {
  console.log('repositories:', repositories);
  return (
    <div>
      <h1>{title}</h1>
      {repositories.map(repo => (
        <div>
          <h3>{repo.name}</h3>
          <p>stars: {repo.stargazers_count}</p>
          <a href={repo.html_url} target="_blank">
            Go to repo
          </a>
        </div>
      ))}
    </div>
  );
};

export const getServerSideProps = async ({ query }) => {
  const packages = query.packages ? query.packages.split(' ') : [];

  try {
    const { data } = await request('GET /search/repositories', {
      q: packages.join('+')
    });

    const { items: repositories, total_count: count } = data;

    const title = `${count} Repositories containing ${packages.join(', ')}`;

    return {
      props: {
        title,
        repositories,
        count
      }
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        repositories: [],
        count: 0
      }
    };
  }
};

export default Repositories;
