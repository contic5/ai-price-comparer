  
async function askOpenAI(prompts:string[]) 
{

  let responses:number[]=[];
  for(let i=0;i<prompts.length;i++)
  {
    const prompt=prompts[i];
    const start_time: number = Date.now();
    const result = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    const end_time: number = Date.now();
    console.log(`Runtime for Prompt ${i+1}: ${end_time-start_time} ms`);

    const data = await result.json();
    const response=data.response;

    if(is_numeric(response))
    {
      responses.push(response);
    }
    else
    {
      responses.push(-1);
    }
  }

  submit_button.disabled=false;
  await handle_responses(responses);
}
async function handle_responses(responses:number[])
{
  console.log(responses);

  document.getElementById("results_progress")!.innerHTML="Results";
  if(loading_interval)
  {
    clearInterval(loading_interval);
    loading_interval=null;
  }

  //const end_time: number = Date.now();
  //console.log(`Total Runtime: ${end_time-start_time} ms`)
  let results=document.getElementById("results") as HTMLDivElement;
  results.innerHTML="";

  for(let i=0;i<Math.min(responses.length,stores.length);i++)
  {
    let row=document.createElement("div");
    row.classList.add("row");
    results.appendChild(row);

    let left_column=document.createElement("div");
    left_column.classList.add("col","border","bg-secondary");
    left_column.innerHTML=stores[i];
    row.appendChild(left_column);

    let right_column=document.createElement("div");
    right_column.classList.add("col","border","bg-secondary");
    if(responses[i]>=0)
    {
      right_column.innerHTML=responses[i].toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    }
    else
    {
      right_column.innerHTML="Unknown";
    }
    row.appendChild(right_column);
  }

}

function is_numeric(value: string): boolean {
  if (typeof value !== 'string' || value.trim() === '') {
    return false;
  }
  return Number.isFinite(Number(value));
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
  submit_button.disabled=true;
  let brand_input=document.getElementById("brand_input") as HTMLInputElement;
  let brand=brand_input.value;

  let item_input=document.getElementById("item_input") as HTMLInputElement;
  let item=item_input.value;
  stores=[];

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

  stores=["Shoprite","Kings","Walmart","Trader Joe's","Whole Foods"];
  let store_inputs=document.getElementsByClassName("store_input") as HTMLCollectionOf<HTMLInputElement>;

  for(let i=0;i<Math.min(store_inputs.length,total_inputs_to_fill);i++)
  {
    store_inputs[i].value=stores[i];
  }

  handle_responses([2,-1])
}

let submit_button=document.getElementById("submit_button") as HTMLButtonElement;
let loading_interval:number|null=null;
let dots=3;
let stores:string[]=[];
//askOpenAI();