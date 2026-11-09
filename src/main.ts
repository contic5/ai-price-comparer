  
async function askOpenAI(prompt:string) 
{
  console.log("Beginning fetch");
  
  const result = await fetch("/api/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });

  const data = await result.json();
  const response=data.response;
  alert(response);
  console.log(response);

  if(loading_interval)
  {
    clearInterval(loading_interval);
  }
  loading_interval=null;

  document.getElementById("results_progress")!.innerHTML="Results";
  document.getElementById("results")!.innerHTML=response;
}

function trim_lines(text:string)
{
  let lines:string[]=text.split("\n");
  console.log(lines);

  for(let i=0;i<lines.length;i++)
  {
    lines[i]=lines[i].trim();
  }

  return lines.join("\n");
}
function update_loading()
{
  dots=(dots+1)%4;
  let results_h2=document.getElementById("results_progress") as HTMLElement;
  results_h2.innerHTML="Loading"+".".repeat(dots);
}
export function handle_submit()
{
  let brand_input=document.getElementById("brand_input") as HTMLInputElement;
  let brand=brand_input.value;

  let item_input=document.getElementById("item_input") as HTMLInputElement;
  let item=item_input.value;
  let stores=[];

  let store_inputs=document.getElementsByClassName("store_input") as HTMLCollectionOf<HTMLInputElement>;
  console.log(store_inputs.length);
  for(let store_input of store_inputs)
  {
    if(store_input.value!="")
    {
      stores.push(store_input.value);
    }
  }

  console.log(item);
  console.log(stores);

  let prompt=
  `Find the price of ${brand} ${item} across the following stores
  ${stores.join(",")}
  Return a JavaScript dictionary containing the name of the store and the price of ${brand} ${item} at that store.
  Set a store's value to null if that store's price cannot be verified. Only return the JavaScript dictionary without the variable declaration.`;
  prompt=trim_lines(prompt);

  prompt=prompt.replace("  ","");
  console.log(prompt);

  if(loading_interval==null)
  {
    loading_interval=setInterval(update_loading,1000);
  }

  askOpenAI(prompt);
}
export function load_test_values()
{
  let item_input=document.getElementById("item_input") as HTMLInputElement;
  item_input.value="Eggs";

  let brand_input=document.getElementById("brand_input") as HTMLInputElement;
  brand_input.value="Eggland";

  let stores=["Shoprite","Kings","Walmart","Trader Joe's","Whole Foods"];
  let store_inputs=document.getElementsByClassName("store_input") as HTMLCollectionOf<HTMLInputElement>;

  for(let i=0;i<store_inputs.length;i++)
  {
    store_inputs[i].value=stores[i];
  }
}

let loading_interval:number|null=null;
let dots=3;
//askOpenAI();