import { allUsers, removeUser } from "@/actions/user";
import Actions from "@/components/Actions";
import { FormSuccess } from "@/components/FormSuccess";
import { RoleGate } from "@/components/role-gate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { currentRole, currentUser } from "@/lib/auth";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { toast } from "sonner";

const AdminPage = async () => {
  const users = await allUsers();
  const role = await currentRole()

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-center text-2xl font-semibold"> المستخدمين</p>
      </CardHeader>
      <CardContent dir="ltr" className="space-y-4">
        {/* <RoleGate allowedRoles="ADMIN"> */}
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user?.image || ""} />
                  <AvatarFallback className="bg-sky-500">
                    <FaUser className="text-white" />
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <Actions user={user} role={role} userId={user.id} />
              </div>
            </div>
          ))}
        {/* </RoleGate> */}
      </CardContent>
    </Card>
  );
};

export default AdminPage;
