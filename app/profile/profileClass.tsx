export default interface Profile {
  name: string;
  id: string;
  createdAt: Date;
  model: "default" | "slim";
  skin: {
    data: Uint8Array;
    hash: Uint8Array;
  };
  cape: {
    data: Uint8Array;
    hash: Uint8Array;
  } | null;
}

export function toProfileInterface(x: {
  name: string;
  id: string;
  model: boolean;
  createdAt: Date;
  skin: {
    hash: Uint8Array;
    data: Uint8Array;
  };
  cape: {
    hash: Uint8Array;
    data: Uint8Array;
  } | null;
}): Profile {
  return {
    name: x.name,
    id: x.id,
    model: x.model ? "slim" : "default",
    createdAt: x.createdAt,
    skin: x.skin,
    cape: x.cape,
  };
}
