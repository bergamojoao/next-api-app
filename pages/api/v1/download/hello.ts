// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';

type Data = {
  name: string
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
  var data =fs.createReadStream('/home/joao/www/my-app/pages/api/download/BT_ANALISES_WEB.pdf');
  res.setHeader('Content-Type', 'application/pdf'); 
  data.pipe(res);
}
