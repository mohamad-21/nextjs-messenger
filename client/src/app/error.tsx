"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import React from "react";

function error(props: any) {
  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-4">
            <p>{props.error.message || "an unknown error occurred. try realoading"}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={props.reset}>Reload</Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default error;
