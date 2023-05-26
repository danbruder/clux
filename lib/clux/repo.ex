defmodule Clux.Repo do
  use Ecto.Repo,
    otp_app: :clux,
    adapter: Ecto.Adapters.Postgres
end
