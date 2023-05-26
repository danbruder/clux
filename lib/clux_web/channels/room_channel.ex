defmodule CluxWeb.RoomChannel do
  use CluxWeb, :channel

  alias Clux.Chrome
  alias CluxWeb.Presence
  alias CluxWeb.ChromeTracker

  @user_id 1

  @impl true
  def join("room:lobby", payload, socket) do
    if authorized?(payload) do
      send(self(), :after_join)

      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_info(:after_join, socket) do
    {:ok, _} = Phoenix.Tracker.track(ChromeTracker, self(), "lobby", 1, %{})
    Chrome.subscribe()

    {:noreply, socket}
  end

  def handle_info({:to_browser, evt, payload}, socket) do
    IO.inspect("~to browser~ #{evt}")
    broadcast!(socket, evt, payload)
    {:noreply, socket}
  end

  def handle_info(evt, socket) do
    {:noreply, socket}
  end

  @impl true
  def handle_in(evt, payload, socket) do
    Chrome.from_browser(evt, payload)
    {:reply, :ok, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
