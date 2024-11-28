interface IDocumentSite {
  getSiteName: () => string;
  getVersion: () => string;
  setVersion: (version: string) => URL;
  getUrl: () => URL;
}

abstract class DocumentSiteAbstract implements IDocumentSite {
  protected url: URL;

  abstract getSiteName(): string;
  abstract getVersion(): string;
  abstract setVersion(version: string): URL;

  constructor(url: URL) {
    this.url = url;
  }

  getUrl = (): URL => this.url;
}

class Readouble extends DocumentSiteAbstract {
  constructor(url: URL) {
    super(url);
  }

  getSiteName = (): string => "readouble";

  getVersion = (): string => this.url.pathname.split("/")[1];

  setVersion = (version: string): URL => {
    this.url.pathname = `/docs/${version}/`;
    return this.url;
  };
}

class Laravel extends DocumentSiteAbstract {
  constructor(url: URL) {
    super(url);
  }

  getSiteName = (): string => "laravel";

  getVersion = (): string => this.url.pathname.split("/")[2];

  setVersion = (version: string): URL => {
    this.url.pathname = `/docs/${version}/`;
    return this.url;
  };
}

export const getDocumentSite = (url: URL): IDocumentSite => {
  const switchMap = {
    "readouble.com": Readouble,
    "laravel.com": Laravel,
  };

  const site = switchMap[url.hostname as keyof typeof switchMap];

  if (site) {
    return new site(url);
  }

  throw new Error("Unknown document site");
};
