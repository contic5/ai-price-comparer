  
async function askOpenAI(prompts:string[]) 
{
  const start_time: number = Date.now();

  const result = await fetch("/api/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompts,
    }),
  });

  const data = await result.json();
  console.log(data);
  const responses=data.responses;
  await handle_responses(responses,start_time);
}
async function handle_responses(responses:string[],start_time:number)
{
  console.log(responses);

  const end_time: number = Date.now();
  console.log(`Total Runtime: ${end_time-start_time} ms`)

  if(loading_interval)
  {
    clearInterval(loading_interval);
    loading_interval=null;
  }

  document.getElementById("results_progress")!.innerHTML="Results";
  document.getElementById("results")!.innerHTML="TODO: DISPLAY RESPONSES";
}

function trim_lines(text:string)
{
  let lines:string[]=text.split("\n");

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
  for(let store_input of store_inputs)
  {
    if(store_input.value!="")
    {
      stores.push(store_input.value);
    }
  }

  let prompts:string[]=[];

  for(let store of stores)
  {
    prompts.push(`Find the price of ${brand} ${item} at ${store}. Only return the price as a number. Return null if the price cannot be verified.`)
  }

  if(loading_interval==null)
  {
    loading_interval=setInterval(update_loading,1000);
  }

  askOpenAI(prompts);
}
export function load_test_values(total_inputs_to_fill=2)
{
  let item_input=document.getElementById("item_input") as HTMLInputElement;
  item_input.value="Eggs";

  let brand_input=document.getElementById("brand_input") as HTMLInputElement;
  brand_input.value="Eggland";

  let stores=["Shoprite","Kings","Walmart","Trader Joe's","Whole Foods"];
  let store_inputs=document.getElementsByClassName("store_input") as HTMLCollectionOf<HTMLInputElement>;

  for(let i=0;i<Math.min(store_inputs.length,total_inputs_to_fill);i++)
  {
    store_inputs[i].value=stores[i];
  }
}

let loading_interval:number|null=null;
let dots=3;
//askOpenAI();