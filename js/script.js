const ul = document.querySelector('ul');
const loadMoreButton = document.querySelector('#load-more');

let repoList = []; // Lista completa de repositórios
let displayedRepos = 0; // Quantidade de repositórios exibidos

function getRepoList(username) {
  fetch(`https://api.github.com/users/${username}/repos`)
    .then(async res => {
      if (!res.ok) {
        throw new Error(res.status);
      }

      const data = await res.json();

      // Ordenar repositórios por data de criação em ordem decrescente
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      repoList = data; // Armazenar a lista completa de repositórios
      displayRepos(12); // Exibir os primeiros 12 repositórios
    })
    .catch(e => console.log(e));
}

function displayRepos(quantity) {
  const reposToShow = repoList.slice(displayedRepos, displayedRepos + quantity);

  reposToShow.map(repo => {
    const li = document.createElement('li');

    const repoName = document.createElement('strong');
    repoName.textContent = repo.name.toUpperCase();
    li.appendChild(repoName);

    const repoUrl = document.createElement('a');
    repoUrl.href = repo.html_url;
    repoUrl.textContent = getShortLink(repo.html_url); // Obter o link curto
    repoUrl.style.color = '#97c5e9'; // Define a cor do link como branco
    li.appendChild(repoUrl);

    const repoDate = document.createElement('span');
    repoDate.textContent = `Data de Criação: ${new Date(repo.created_at).toLocaleString('pt-BR')}`;
    li.appendChild(repoDate);

    ul.appendChild(li);
  });

  displayedRepos += quantity;

  // Verificar se há mais repositórios para exibir
  if (displayedRepos >= repoList.length) {
    loadMoreButton.style.display = 'none'; // Esconder o botão de "Carregar Mais"
  }
}

function getShortLink(url) {
  // Extrair apenas o link curto
  const shortLink = url.replace('https://github.com/', '');
  return shortLink;
}

getRepoList('AlanPrates');

loadMoreButton.addEventListener('click', () => {
  displayRepos(12);
});
