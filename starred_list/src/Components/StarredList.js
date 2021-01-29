import React, { Component } from 'react';
import './StarredList.css';

class StarredList extends Component {
    constructor() {
        super();
        this.state = {
            repoList: undefined,
            page: undefined,
            maxPage: undefined,
        };
        this.saveFetchedData = this.saveFetchedData.bind(this);
    }

    componentDidMount() {
        this.setState({
            repoList: [],
            page: 1,
            maxPage: 34,
        });
        this.getGithubRepos(this.state.page);
    }

    getGithubRepos = async(page) => {
        const today = new Date();
        const priorDate = new Date(today.setDate(today.getDate() - 30));
        const dateString = priorDate.getFullYear() + '-' + (priorDate.getMonth() + 1) + '-' + priorDate.getDate();
        let url = 'https://api.github.com/search/repositories?q=created:>' + dateString + '&sort=stars&order=desc';
        if (page > 1)
            url += '&page=' + page;
        const APICall = await fetch(url);
        const response = await APICall.json();
        this.saveFetchedData(response.items);

        // const maxPageSearch = 34;
        // for (let i = 1; i <= maxPageSearch; i++) {
        //     if (i > 1)
        //         url += '&page=' + i;
        //     const APICall = await fetch(url);
        //     const response = await APICall.json();
        //     if (response.items !== undefined)
        //         this.saveFetchedData(response.items);
        // }
        // while (!finishedFetching) {
        //     if (page > 1)
        //         url += '&page=' + page;
        //     const APICall = await fetch(url);
        //     const response = await APICall.json();
        //     this.saveFetchedData(response.items);
        //     if (response.items)
        // }

        
    }

    saveFetchedData(items) {
        let repoList = this.state.repoList;
        for (let i = 0; i < items.length; i++) {
            repoList.push({
                repoName: items[i].name,
                repoDescription: items[i].description,
                ownerName: items[i].owner.login,
                ownerAvatar: items[i].owner.avatar_url,
                starsCount: items[i].stargazers_count,
                issuesCount: items[i].open_issues_count
            });
        }
        this.setState({ repoList });
        console.log(this.state.repoList);
    }

    render() {
        // console.log(this.state.repoList);
        return (
            <div>
                Hi
            </div>
        );
    }
  }
  
  export default StarredList;