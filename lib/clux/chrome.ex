defmodule Clux.Chrome do 

  @topic inspect(__MODULE__)

  def from_browser(evt, payload) do 
    IO.inspect("got #{evt} from browser")
  end

  def to_browser(evt, payload) do 
    IO.inspect("Sending #{evt} to browser")
    payload
    |> broadcast(:to_browser, evt)
  end

  def chrome_exited do 
    IO.inspect("Chrome exited")
  end

  def subscribe() do
    IO.inspect("subscribing")
    Phoenix.PubSub.subscribe(Clux.PubSub, @topic)
  end

  def broadcast({:ok, result}, subject, event) do
    Phoenix.PubSub.broadcast(Clux.PubSub, @topic, {subject, event, result})
    {:ok, result}
  end

  def broadcast({:error, _} = error, _subject, _event), do: error

  def broadcast(payload, subject, event) do
    Phoenix.PubSub.broadcast(Clux.PubSub, @topic, {subject, event, payload})
    payload
  end
end
