import {
  Avatar,
  Box,
  Flex,
  Menu as ChakraMenu,
  MenuButton,
  MenuItem as ChakraMenuItem,
  MenuItemOption,
  MenuList as ChakraMenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import Logo from "./Logo";
import Menu from "./Menu";
import MenuItem from "./MenuItem";
import MenuToggle from "./Menutoggle";

import { DataContext } from "./providers/DataProvider";

const Header: React.FC<{}> = (props) => {
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  const toggle = () => setIsHeaderMenuOpen(!isHeaderMenuOpen);
  const {
    user: { loggedinUser, logout },
  } = useContext(DataContext);
  return (
    <Box as="header" w="100%">
      <Flex
        as="nav"
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        wrap="wrap"
        w="99%"
        mb={0}
        p={5}
        bg={"transparent"}
      >
        <Logo />
        <MenuToggle toggle={toggle} isOpen={isHeaderMenuOpen} />
        <Box
          display={{ base: isHeaderMenuOpen ? "block" : "none", md: "block" }}
          flexBasis={{ base: "100%", md: "auto" }}
          justifyContent="flex-end"
        >
          <Menu>
            <MenuItem to="/plans" isLast="false">
              Plans
            </MenuItem>
            <MenuItem to="/faq" isLast={false}>
              FAQ
            </MenuItem>
            <MenuItem to="/about" isLast={loggedinUser ? false : true}>
              About
            </MenuItem>
            {loggedinUser && (
              <MenuItem to="#" isLast >
                <ChakraMenu>
                  <MenuButton as="button">
                    <Avatar
                      src={loggedinUser.avatar}
                      name={loggedinUser.name}
                      size="sm"
                    ></Avatar>
                  </MenuButton>
                  <ChakraMenuList>
                      <MenuOptionGroup>
                          <MenuItemOption onClick={logout}>Logout</MenuItemOption>
                      </MenuOptionGroup>
                  </ChakraMenuList>
                </ChakraMenu>
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
