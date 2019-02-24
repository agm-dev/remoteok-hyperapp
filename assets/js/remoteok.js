const DEFAULT_BASE_URL = 'https://remoteok.io/api';

class RemoteOk {

  constructor(config = {}) {
    this.baseUrl = typeof config.baseUrl === 'string' && config.baseUrl.length ? config.baseUrl : DEFAULT_BASE_URL;
    this.fallbackUrl = typeof config.fallbackUrl === 'string' && config.fallbackUrl.length ? config.fallbackUrl : '';
    this.data = [];
    this.error = null;
  }

  getData(url = this.baseUrl) {
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        this.data = typeof data !== 'undefined' && Array.isArray(data) && data.length ? data : [];
        return true;
      })
      .catch(err => {
        this.error = err;

      });
  }

  getTags(data = this.data) {
    return data.reduce((final, current) => {
      if (typeof current.tags !== 'undefined' && Array.isArray(current.tags)) {
        const toAdd = current.tags
          .filter(item => !final.includes(item))
          .map(item => item.toLowerCase());
        return [...final, ...toAdd];
      }
      return final;
    }, []);
  }

  getJobsByTags(tags = [], condition = 'OR', data = this.data) {
    condition = condition === 'AND' ? condition : 'OR';

    const matchesCondition = condition => item => {
      if (condition === 'AND') {
        return tags.every(tag => item.tags.includes(tag));
      }
      return tags.some(tag => item.tags.includes(tag));
    }

    return data
      .filter(item => Array.isArray(item.tags))
      .filter(matchesCondition(condition));
  }

  setData(data = []) {
    this.data = typeof data === 'string' ? JSON.parse(data) : data;
  }

}
