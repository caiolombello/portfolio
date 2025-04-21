declare module "@vercel/blob" {
  interface BlobObject {
    pathname: string;
    url: string;
  }

  interface ListResponse {
    blobs: BlobObject[];
  }

  interface PutOptions {
    contentType?: string;
    access?: "public" | "private";
    addRandomSuffix?: boolean;
  }

  export function put(
    key: string,
    data: string | Buffer,
    options?: PutOptions,
  ): Promise<BlobObject>;
  export function list(options: { prefix: string }): Promise<ListResponse>;
}
