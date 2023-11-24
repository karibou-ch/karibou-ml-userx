//
//
// export API


export const cleanTags = (text) => {
  return text.replace(/<br>(?=(?:\s*<[^>]*>)*$)|(<br>)|<[^>]*>/gi, (x, y) => y ? ' & ' : '');//.slice(0, text.indexOf('.')).replace(/(\r\n|\n|\r)/gm, "")
}

export const dateInMonths = (when) => {
  const onemonth=86400000*30;
  const today = Date.now();
  //
  // time lapse in months
  return ((today-when.getTime())/onemonth);
}



export const dateBetweeThan=(date,weeks)=>{
  let now=new Date();
  date = new Date(date);
  return datePlusDays(date,weeks*7)>now;
}

export const datePlusDays=(date,nb) => {
  const plus=new Date(date);
  plus.setDate(date.getDate()+nb);
  return plus;
}

export const memoryUsage = (info)=> {
  const format = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;

  const memoryData = process.memoryUsage();

  const memoryUsage = {
    heapTotal: `${format(memoryData.heapTotal)} -> total size allocated heap`,
    heapUsed: `${format(memoryData.heapUsed)} -> heap used for ${info}`
  };  
  console.log(memoryUsage);
}


export const orderToLeanObject = (order) => {
  const obj = {
    customer: {
      id: order.customer.id,
      likes: order.customer.likes,
      plan:order.customer.plan,
    },
    items: order.items,
    shipping: {
      when: (order.shipping.when.$date ? new Date(order.shipping.when.$date) : new Date(order.shipping.when))
    }
  }
  return obj;
}

export const productToLeanObject = (product) => {
  const regex = /^([^.;:]+)$/gm;

  const tags: string[] = [];
  const isLean = !product.details;
  const bio = !isLean && (    
    product.details.bio ||
    product.details.biodynamics ||
    product.details.bioconvertion
  ) || (product.bio);

  if ((!isLean) && (bio)) {
    tags.push('bio');
  }
  if ((!isLean) && (product.details.homemade || product.details.handmade)) {
    tags.push('artisanal');
  }
  if ((!isLean) && (!bio) && (product.details.natural) || (product.naturel)) {
    tags.push('naturel');
  }

  let categories = (product.categories.slug || product.categories).toLocaleLowerCase();
  if(categories && product.belong && product.belong.name){
    categories = (categories+'; '+product.belong.name).toLocaleLowerCase();
  }

  const vendor = isLean ? (product.vendor||''):(product.vendor.name ? product.vendor.name: product.vendor);
  const discount = (isLean?product.discount:product.attributes.discount);
  const boost = (isLean?product.boost:product.attributes.boost);
  const description = cleanTags(product.description||product.details.description).toLocaleLowerCase();
  const short = regex.exec(description)
  const text = `
  Titre: ${product.title.toLocaleLowerCase()}
  Context: ${categories}
  Description: ${short?short[1]:description}
  `;


  const obj = {
    sku: product.sku,
    title: product.title.toLocaleLowerCase(),
    boost,
    discount,
    categories,
    vendor,
    created:product.created,
    updated:product.updated,
    tags: (tags.join(',')),
    text
  };
  //
  // text: (product.title + ' (' + tags.join(',') + ') (description):' + description + ')').replace('()', '')

  return obj;
}


export const downloadProducts = async (skus, options)=>{
  const query = skus.join('&skus=');
  const url = `https://${options.server}/api/v1/products?skus=${query}`;
  const response = await options.axios.get(url);
  const products = response.data ||[];
  if(!options.tiny) {
    return products.sort(sortByTitle);
  }
  return products.map(productToLeanObject).sort(sortByTitle);
}


//
// private api
const sortByTitle = ((a,b)=>{
  return a.title.localeCompare(b.title);
})